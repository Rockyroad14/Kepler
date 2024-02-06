#!/bin/bash

#SBATCH -N1 -n1 --mem-per-cpu=100M -t00:05:00 --qos=test
#SBATCH -J hostname

hostname

exit $?