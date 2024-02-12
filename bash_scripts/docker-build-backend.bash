cd backend_kepler
echo "Building Image:"

# for the name its [docker username]/kepler_frontend:latest
docker build --tag thomas3212/kepler_backend .


## runs docker container, only use this if you want to run it only as a docker image, comment out if you
## are going to run it in kubernetes, this is because vite runs but it can't be closed out
## which means the important part of pushing it afterwards never occurs
# docker run --name kepler_backend_container -p 3000:3000 thomas3212/kepler_backend

## comment this out if you're not using kubernetes
docker push thomas3212/kepler_backend

## Use this to remove running docker containers to avoid port issues when using k8s
# docker kill $(docker ps -q --filter ancestor=thomas3212/kepler_frontend)
# docker container prune

