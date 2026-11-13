const express = require('express');
const path = require('path');

const app = express();

const viewsPath = path.join(__dirname, 'views');
const publicPath = path.join(__dirname, 'public');
const jobs = require('./data/jobs.json');
const companies = require('./data/companies.json');

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.render('pages/home', {
    featuredJobs: jobs.slice(0, 3),
    companies,
    basePath: '.'
  });
});

app.get('/jobs', (req, res) => {
  res.render('pages/jobs', {
    jobs,
    basePath: '..'
  });
});

app.get('/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).send('Job not found');
  }

  const company = companies.find(c =>
    c.id === job.companyId || (job.company && c.name === job.company.name)
  );

  res.render('pages/job-details', {
    job,
    company,
    applied: req.query.applied === '1',
    basePath: '../..'
  });
});

app.get('/apply/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).send('Job not found');
  }

  res.render('pages/apply', {
    job,
    basePath: '../..'
  });
});

app.post('/apply/:id', (req, res) => {
  res.redirect(`/jobs/${encodeURIComponent(req.params.id)}?applied=1`);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});