
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.get('/api/contacts', async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);
});

app.post('/api/contacts', async (req, res) => {
  const contact = await prisma.contact.create({ data: req.body });
  res.json(contact);
});

app.get('/api/contacts/:id', async (req, res) => {
  const contact = await prisma.contact.findUnique({ where: { id: parseInt(req.params.id) } });
  contact ? res.json(contact) : res.status(404).json({ error: 'Not found' });
});

app.put('/api/contacts/:id', async (req, res) => {
  const contact = await prisma.contact.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(contact);
});

app.delete('/api/contacts/:id', async (req, res) => {
  await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ msg: 'deleted' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
