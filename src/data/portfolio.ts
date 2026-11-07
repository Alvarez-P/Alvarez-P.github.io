export interface Metric {
  value: string;
  label: string;
}

export interface Role {
  title: string;
  period: string;
  summary: string;
  metrics: Metric[];
  note: string;
}

export const roles: Role[] = [
  {
    title: 'INFOTEC · Senior Backend Engineer',
    period: 'May 2023 – Mar 2026',
    summary: 'Plataforma nacional de Internet para Todos (CFE Telecomunicaciones).',
    metrics: [
      { value: '118,174+', label: 'puntos de internet' },
      { value: '10+', label: 'microservicios' },
      { value: '2', label: 'mapas públicos' },
    ],
    note: 'Único backend de un equipo de 3 y después responsable de proyectos y repositorios. Clean Architecture y casi todo el backend en NestJS.',
  },
  {
    title: 'HappyGuest · Backend & Cloud Engineer',
    period: 'Feb 2022 – Ene 2023',
    summary: 'PMS multitenant para hoteles de 4 y 5 estrellas.',
    metrics: [
      { value: '50+', label: 'hoteles' },
      { value: '80+', label: 'Lambdas a TypeScript en 2 semanas' },
      { value: '100+', label: 'Lambdas desplegadas' },
    ],
    note: 'Migré de Serverless Framework a AWS CDK: aprendí la herramienta en una semana y llevé toda la producción.',
  },
];

export const earlierWork =
  'Antes: ADC (desde 2018), Derby Technologies y Beelieff. Hoy: proyectos propios y asesorías.';

export interface Project {
  name: string;
  status: string;
  desc: string;
  tech: string;
}

export const projects: Project[] = [
  {
    name: 'tickets-handler',
    status: 'En desarrollo',
    desc: 'Tickets con DDD, CQRS (PostgreSQL para escribir, Elasticsearch para leer), eventos con Kafka o RabbitMQ y clasificación con IA.',
    tech: 'NestJS · DDD · CQRS',
  },
  {
    name: 'Kopere',
    status: 'En desarrollo',
    desc: 'PWA para organizadores de tandas y préstamos personales. Monorepo pnpm con backend, frontend y paquete compartido.',
    tech: 'NestJS · Prisma · React · Vitest',
  },
  {
    name: 'alvaress',
    status: 'Publicado',
    desc: 'Agente para OpenCode con un modelo de decisión local que enruta tareas y reduce el consumo de tokens, con flujos SDD/ODD.',
    tech: 'OpenCode · Laya · SDD/ODD',
  },
];

export type Layer = 'domain' | 'app' | 'infra';

export interface StackGroup {
  title: string;
  layer: Layer;
  items: string[];
}

export const stack: StackGroup[] = [
  { title: 'Arquitectura', layer: 'domain', items: ['DDD', 'Clean Architecture', 'SOLID', 'Microservicios', 'CQRS', 'Event-driven'] },
  { title: 'Lenguajes', layer: 'domain', items: ['TypeScript', 'JavaScript', 'Python', 'Java'] },
  { title: 'Backend', layer: 'app', items: ['NestJS', 'Node.js', 'Express', 'HapiJS', 'REST', 'GraphQL', 'WebSockets'] },
  { title: 'Frontend', layer: 'app', items: ['React', 'Next.js', 'Tailwind CSS', 'Zustand'] },
  { title: 'Bases de datos y ORMs', layer: 'infra', items: ['PostgreSQL', 'PostGIS', 'MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'Prisma', 'Drizzle', 'TypeORM'] },
  { title: 'Cloud (AWS)', layer: 'infra', items: ['Lambda', 'API Gateway', 'S3', 'CloudWatch', 'AWS CDK'] },
  { title: 'Mensajería y eventos', layer: 'infra', items: ['SQS', 'SNS', 'EventBridge', 'Kafka', 'RabbitMQ'] },
  { title: 'DevOps y testing', layer: 'infra', items: ['Docker', 'GitHub Actions', 'Bitbucket Pipelines', 'Grafana', 'Jest', 'Vitest'] },
  { title: 'IA aplicada', layer: 'domain', items: ['Claude Code', 'OpenCode', 'GitHub Copilot', 'n8n', 'SDD', 'ODD'] },
];

export const learning = 'Aprendiendo: Terraform, Kubernetes, Go, RAG, LangChain, bases de datos vectoriales.';

export const cv = {
  es: '/cv/CV-Esteban-Alvarez-ES.pdf',
  en: '/cv/CV-Esteban-Alvarez-EN.pdf',
};
