#!/bin/bash
docker load -i $1.tar
docker run  --name $1 -v /home/kepler/Kepler/backend_kepler/jobs/$2/output