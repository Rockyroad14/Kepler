const Slurm = require('slurmjs');

// Replace these values with your Slurm cluster information
const clusterConfig = {
  host: '10.171.25.37',
  user: 'kepler',
  privateKey: 'path/to/private/key',
};

const slurm = new Slurm(clusterConfig);

// Example job submission parameters
const jobParams = {
  name: 'exampleJob',
  script: 'echo "Hello, Slurm!"',
  partition: 'your-partition-name',
  cpus: 1,
  nodes: 1,
  time: '00:10:00',
};


// Submit the job
slurm.submitJob(jobParams)
  .then((jobId) => {
    console.log(`Job submitted successfully. Job ID: ${jobId}`);
  })
  .catch((err) => {
    console.error('Error submitting job:', err.message);
  });