# NexFlow — Kubernetes Deployment

This folder contains all Kubernetes manifests to deploy NexFlow on any K8s cluster
(local with minikube/kind, or cloud with GKE/EKS/AKS).

## Folder Structure

```
k8s/
├── namespace.yaml              # nexflow namespace
├── secrets.yaml                # Passwords, JWT secret, Stripe key, Google Client ID
├── configmap.yaml              # Shared non-sensitive config & service URLs
├── hpa.yaml                    # HorizontalPodAutoscalers (auto-scaling)
├── infrastructure/
│   ├── rabbitmq.yaml           # RabbitMQ broker (AMQP + Management UI)
│   ├── postgres.yaml           # 5 × PostgreSQL instances (one per service)
│   ├── mongodb.yaml            # MongoDB for resource-service
│   └── redis.yaml              # Redis cache
├── services/
│   ├── api-gateway.yaml        # API Gateway + Ingress
│   ├── customer-service.yaml
│   ├── resource-service.yaml
│   ├── booking-service.yaml
│   ├── payment-service.yaml
│   ├── notification-service.yaml
│   ├── tracking-service.yaml
│   └── location-simulator.yaml
└── frontend/
    └── frontend.yaml           # React SPA
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| kubectl | ≥ 1.28 | Cluster management |
| Docker | ≥ 24 | Build images |
| minikube or kind | latest | Local cluster (dev only) |

---

## Step 1 — Build Docker Images

From the project root, build and tag each service image:

```bash
docker build -t nexflow/customer-service:latest     ./services/customer-service
docker build -t nexflow/resource-service:latest     ./services/resource-service
docker build -t nexflow/booking-service:latest      ./services/booking-service
docker build -t nexflow/payment-service:latest      ./services/payment-service
docker build -t nexflow/notification-service:latest ./services/notification-service
docker build -t nexflow/tracking-service:latest     ./services/tracking-service
docker build -t nexflow/api-gateway:latest          ./services/api-gateway
docker build -t nexflow/location-simulator:latest   ./services/location-simulator
docker build -t nexflow/frontend:latest             ./frontend
```

**If using minikube**, load images directly (no registry needed):
```bash
minikube image load nexflow/customer-service:latest
minikube image load nexflow/resource-service:latest
minikube image load nexflow/booking-service:latest
minikube image load nexflow/payment-service:latest
minikube image load nexflow/notification-service:latest
minikube image load nexflow/tracking-service:latest
minikube image load nexflow/api-gateway:latest
minikube image load nexflow/location-simulator:latest
minikube image load nexflow/frontend:latest
```

---

## Step 2 — Edit Secrets

Before deploying, open `k8s/secrets.yaml` and replace the placeholder values:

```yaml
stripe-secret-key: "sk_test_REPLACE_ME"         # Your Stripe test key
google-client-id:  "REPLACE_ME.apps.googleusercontent.com"
```

---

## Step 3 — Deploy Everything

```bash
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Shared config
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Infrastructure (databases + message broker)
kubectl apply -f k8s/infrastructure/

# Wait for infrastructure to be ready
kubectl wait --for=condition=ready pod -l app=rabbitmq   -n nexflow --timeout=120s
kubectl wait --for=condition=ready pod -l app=postgres-customer -n nexflow --timeout=120s

# Application services
kubectl apply -f k8s/services/
kubectl apply -f k8s/frontend/

# Auto-scaling (optional but recommended)
kubectl apply -f k8s/hpa.yaml
```

---

## Step 4 — Verify Deployment

```bash
# Check all pods are Running
kubectl get pods -n nexflow

# Check services
kubectl get services -n nexflow

# Check ingress
kubectl get ingress -n nexflow
```

Expected output — all pods should show `Running` and `READY 1/1` (or `2/2`):
```
NAME                           READY   STATUS    RESTARTS
api-gateway-xxx                2/2     Running   0
booking-service-xxx            2/2     Running   0
customer-service-xxx           2/2     Running   0
notification-service-xxx       2/2     Running   0
payment-service-xxx            2/2     Running   0
resource-service-xxx           2/2     Running   0
tracking-service-xxx           2/2     Running   0
frontend-xxx                   2/2     Running   0
rabbitmq-xxx                   1/1     Running   0
postgres-customer-xxx          1/1     Running   0
...
```

---

## Step 5 — Access the Application

**Local (minikube):**
```bash
# Enable ingress addon
minikube addons enable ingress

# Get the minikube IP
minikube ip
# e.g. 192.168.49.2

# Add to /etc/hosts
echo "192.168.49.2  nexflow.local" | sudo tee -a /etc/hosts

# Open in browser
open http://nexflow.local
```

**API Gateway directly:**
```bash
kubectl port-forward service/api-gateway 8080:8080 -n nexflow
# Then: http://localhost:8080
```

---

## Useful Commands

```bash
# View logs for a service
kubectl logs -l app=booking-service -n nexflow --tail=50 -f

# Describe a failing pod
kubectl describe pod <pod-name> -n nexflow

# Scale a deployment manually
kubectl scale deployment booking-service --replicas=3 -n nexflow

# Check HPA status
kubectl get hpa -n nexflow

# Access RabbitMQ management UI
kubectl port-forward service/rabbitmq 15672:15672 -n nexflow
# Then: http://localhost:15672  (admin / admin123)

# Tear everything down
kubectl delete namespace nexflow
```

---

## Architecture Notes

- **Namespace isolation**: all resources live in the `nexflow` namespace.
- **Separate databases**: each service has its own PVC and PostgreSQL/MongoDB instance — no shared schemas.
- **Secrets**: sensitive values (passwords, keys) are stored in a K8s Secret, never in ConfigMaps.
- **Health checks**: every service has `readinessProbe` + `livenessProbe` on its `/health` endpoint.
- **Auto-scaling**: the API Gateway, Booking, and Payment services scale automatically via HPA (CPU ≥ 70%).
- **Replicas**: application services run with `replicas: 2` by default for high availability.
