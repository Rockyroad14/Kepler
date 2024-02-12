cd frontend_kepler
echo "Building Image:"

# for the name its [docker username]/kepler_frontend:latest
docker build --tag thomas3212/kepler_frontend .


## runs docker container, only use this if you want to run it only as a docker image, comment out if you
## are going to run it in kubernetes, this is because vite runs but it can't be closed out
## which means the important part of pushing it afterwards never occurs
# docker run --name kepler_frontend_container -p 5050:5050 thomas3212/kepler_frontend

## comment this out if you're not using kubernetes
docker push thomas3212/kepler_frontend

## Use this to remove running docker containers to avoid port issues when using k8s
# docker kill $(docker ps -q --filter ancestor=thomas3212/kepler_frontend)
# docker container prune

