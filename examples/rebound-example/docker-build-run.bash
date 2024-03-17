echo "Building Image:"
docker build --tag rebound-example .

echo -e "Running Container:"
docker run --name rebound-example rebound-example

# save image as tar file
# docker save -o rebound-example.tar rebound-example

# load tar file
# docker load -i rebound-example.tar