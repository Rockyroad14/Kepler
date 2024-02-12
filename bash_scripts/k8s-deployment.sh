# minikube start if port issues

# deletes any old deployment and services first 
kubectl delete deployment kepler-frontend
kubectl delete service kepler-frontend
kubectl delete deployment kepler-backend
kubectl delete service kepler-backend

kubectl apply -f kubernetes/

# port forwards
# pkill -f "port-forward"

# appPod=$(kubectl get pods -n default -l app=kepler-frontend --output=jsonpath={.items..metadata.name})

## used to access the kubernetes pod. how it works is that in the manifests, we mentioned that it runs internally in the pod
## on port 5050. So we then tell it to externally expose it on our machine port 5059.
# kubectl port-forward deployment/kepler-frontend 5059:5050