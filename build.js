const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const jobs = require('./data/jobs.json');
const companies = require('./data/companies.json');

const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(path.join(distDir, 'jobs'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'apply'), { recursive: true });

if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

async function build() {
  const homeHtml = await ejs.renderFile(path.join(__dirname, 'views/pages/home.ejs'), {
    featuredJobs: jobs.slice(0, 3),
    companies,
    basePath: '.'
  });
  fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml);

  const jobsHtml = await ejs.renderFile(path.join(__dirname, 'views/pages/jobs.ejs'), {
    jobs,
    basePath: '..'
  });
  fs.writeFileSync(path.join(distDir, 'jobs', 'index.html'), jobsHtml);

  for (const job of jobs) {
    const company = companies.find(c =>
      c.id === job.companyId || (job.company && c.name === job.company.name)
    );

    const detailsDir = path.join(distDir, 'jobs', job.id);
    fs.mkdirSync(detailsDir, { recursive: true });
    const detailsHtml = await ejs.renderFile(path.join(__dirname, 'views/pages/job-details.ejs'), {
      job,
      company,
      applied: false,
      basePath: '../..'
    });
    fs.writeFileSync(path.join(detailsDir, 'index.html'), detailsHtml);

    const applyDir = path.join(distDir, 'apply', job.id);
    fs.mkdirSync(applyDir, { recursive: true });
    const applyHtml = await ejs.renderFile(path.join(__dirname, 'views/pages/apply.ejs'), {
      job,
      basePath: '../..'
    });
    fs.writeFileSync(path.join(applyDir, 'index.html'), applyHtml);
  }

  console.log('Static build ready in /dist');
}

build();