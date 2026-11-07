"""Genera CV-Esteban-Alvarez-{ES,EN}.pdf. Uso: cv/.venv/bin/python cv/build.py"""
from html import escape
from pathlib import Path
from weasyprint import HTML

OUT = Path(__file__).parent
EMAIL = "alvarez.p.esteban@gmail.com"
LINKS = {
    "LinkedIn": "https://www.linkedin.com/in/adolfo-esteban-alvarez-pacheco",
    "GitHub": "https://github.com/Alvarez-P",
}

CSS = """
@page { size: Letter; margin: 12mm 14mm; }
body { font-family: 'Liberation Sans', Arial, sans-serif; font-size: 9.3pt; line-height: 1.28; color: #111; }
h1 { font-size: 17pt; margin: 0; }
.title { font-weight: bold; font-size: 10.5pt; margin: 1px 0; }
.contact { margin: 2px 0 0; }
a { color: #111; text-decoration: none; }
h2 { font-size: 10.5pt; text-transform: uppercase; border-bottom: 1px solid #555; margin: 10px 0 4px; padding-bottom: 1px; }
h3 { font-size: 9.8pt; margin: 7px 0 0; display: flex; justify-content: space-between; }
h3 span.d { font-weight: normal; }
p { margin: 2px 0; }
ul { margin: 2px 0 0; padding-left: 15px; }
li { margin: 0.5px 0; }
.sk p { margin: 1px 0; }
.tech { margin-top: 2px; }
"""

# Cada entrada: (empresa/puesto, fechas, descripción opcional, [bullets], tecnologías)
CONTENT = {
    "es": {
        "lang": "es",
        "title": "Senior Backend Engineer | Full Stack Developer",
        "keywords": "Node.js · TypeScript · NestJS · React · Next.js · AWS · Microservicios · DDD",
        "location": "Mérida, Yucatán, México · Disponible",
        "h": {"summary": "Resumen", "skills": "Habilidades", "exp": "Experiencia", "proj": "Proyectos",
              "edu": "Educación", "lang": "Idiomas"},
        "summary": (
            "Ingeniero en Sistemas Computacionales con <b>más de 6 años</b> de experiencia en desarrollo Full Stack, "
            "con foco senior en <b>backend con Node.js, TypeScript y NestJS</b> y arquitecturas cloud en <b>AWS</b> "
            "(Serverless, AWS CDK). Diseño de <b>microservicios</b>, Clean Architecture y DDD; nivel junior/mid en "
            "frontend con React y Next.js. Desarrollo asistido por IA con <b>SDD</b> y <b>ODD</b> según el tamaño del "
            "cambio, y herramientas propias para reducir el consumo de tokens. Experiencia en telecomunicaciones, "
            "hotelería, logística, educación y recursos humanos."
        ),
        "skills": [
            ("Lenguajes", "TypeScript, JavaScript, Node.js, Python, Java. Aprendiendo: Go"),
            ("Backend", "NestJS, Express, HapiJS, Restify, REST, GraphQL, WebSockets, JWT, OAuth, OpenAPI"),
            ("Frontend", "React, Next.js, HTML5, CSS3, Tailwind CSS, Zustand (nivel junior/mid)"),
            ("Arquitectura", "Microservicios, Clean Architecture, DDD, SOLID, Serverless, "
                             "arquitectura orientada a eventos, CQRS"),
            ("Bases de datos", "PostgreSQL, PostGIS, MySQL, MongoDB, DynamoDB, Redis. "
                               "ORMs: Prisma, TypeORM, Drizzle, Sequelize, Mongoose"),
            ("Cloud (AWS)", "Lambda, API Gateway, S3, SNS, Step Functions, CloudWatch, "
                            "EC2, VPC, RDS, IAM, AWS CDK. Aprendiendo: Terraform, Kubernetes"),
            ("Mensajería", "Kafka, RabbitMQ"),
            ("DevOps / CI-CD", "Docker, Docker Compose, Bitbucket Pipelines, GitHub Actions, GitLab, Git/Gitflow, "
                               "Grafana, CloudWatch"),
            ("Testing", "Jest, Vitest, Supertest, Mocha"),
            ("IA aplicada", "Claude Code, OpenCode, GitHub Copilot, n8n, SDD, ODD. "
                            "Aprendiendo: RAG, LangChain, embeddings, bases de datos vectoriales, LLM workflows."),
            ("Prácticas", "Code reviews, mentoría técnica, Scrum/Agile, estimación, optimización de rendimiento"),
        ],
        "exp": [
            ("INFOTEC – Senior Backend Engineer", "Mayo 2023 – Marzo 2026",
             "Plataforma nacional de Internet para Todos (CFE Telecomunicaciones) para gestionar la operación "
             "logística de infraestructura de conectividad en todo México: proveedores, contratos, materiales, "
             "sitios de instalación, evidencias fotográficas y seguimiento operativo.",
             ["Único desarrollador backend en un equipo de 3; en el último año, pasé a ser el responsable de "
              "los proyectos, repositorios y la coordinación con análisis y DevOps.",
              "Diseñé la arquitectura backend con Clean Architecture y <b>más de 10 microservicios</b> (autenticación, "
              "usuarios, logística, instalaciones, entre otros) y desarrollé prácticamente todo el backend con NestJS.",
              "Plataforma con <b>más de 118,174 puntos de internet</b> registrados y operando (4G, satelital, "
              "fibra óptica y cobre), publicados en dos mapas públicos usando tipos de datos geométricos: "
              "mapa.internetparatodos.cfe.mx y cabinas.internetparatodos.cfe.mx.",
              "Diseñé APIs REST consumidas por aplicaciones web y móviles (personal administrativo e instaladores).",
              "Implementé carga de archivos, reportes Excel/PDF y notificaciones por correo.",
              "Participé en el frontend con React y Next.js (módulos administrativos).",
              "Definí estándares de desarrollo, hice code reviews y mentoría técnica, y participé en estimación y "
              "decisiones de arquitectura."],
             "Node.js, TypeScript, NestJS, PostgreSQL, PostGIS, React, Next.js, AWS, Docker, JWT, Microservicios"),
            ("HAPPYGUEST – Backend & Cloud Engineer", "Febrero 2022 – Enero 2023",
             "PMS multitenant para hoteles de 4 y 5 estrellas (administración, restaurantes, eventos y amenidades) "
             "con <b>más de 50 hoteles</b> en México.",
             ["Migré <b>más de 80 funciones Lambda</b> de JavaScript a TypeScript durante las primeras dos semanas.",
              "Migré la infraestructura de Serverless Framework a <b>AWS CDK</b>: aprendí la herramienta en la primera "
              "semana y fui responsable de configurar todo lo que estaba en producción, así como de los despliegues.",
              "Desarrollé y desplegué <b>más de 100 Lambdas</b>; introduje Lambda Layers para reducir dependencias "
              "duplicadas y mejorar los despliegues.",
              "Diseñé el módulo completo de reservación de eventos y flujos serverless "
              "(API Gateway, Lambda, DynamoDB, EventBridge, SNS) para recordatorios push.",
              "Desarrollé reportes integrando Zendesk, Grafana y servicios internos; usé CloudWatch y Grafana "
              "para análisis de logs.",
              "Participé en decisiones de arquitectura cloud y en code reviews con el líder del proyecto."],
             "AWS CDK, Lambda, API Gateway, DynamoDB, SNS, EventBridge, CloudWatch, RDS MySQL, TypeScript, "
             "Bitbucket Pipelines"),
            ("DERBY TECHNOLOGIES – Backend Developer", "Nov 2021 – Ene 2022",
             "APIs REST y nuevas funcionalidades para una plataforma de logística, bajo Scrum.",
             [], "Node.js, Restify, AWS, MongoDB"),
            ("BELIEFF – Backend Developer Intern", "Marzo 2020 – Octubre 2021",
             "Backend de una plataforma de encuestas dinámicas para reclutamiento (RR. HH.), bajo Scrum; primer "
             "contacto profesional con DynamoDB y AWS.",
             [], "Node.js, AWS, DynamoDB"),
            ("ADC – Software Engineer & Technical Instructor", "2018 – Actualidad (intermitente)",
             "Ingreso por un programa de formación técnica para estudiantes de alto desempeño; después, proyectos "
             "para clientes reales e instrucción técnica a nuevos desarrolladores.",
             ["Backend para educación, CRM, dashboards y plataformas empresariales: APIs REST, GraphQL y WebSockets.",
              "SaaS educativo para gestión de cursos, tareas y calificaciones.",
              "Optimización con SQL puro en lugar de ORM cuando el proyecto lo requería."],
             "Node.js, TypeScript, NestJS, Express, HapiJS, GraphQL, PostgreSQL, MongoDB, AWS Lambda, S3"),
            ("Independiente – Proyectos propios y asesorías", "2026 – Actualidad",
             "Asesorías técnicas y desarrollo de proyectos propios (ver sección Proyectos).",
             [], None),
        ],
        "proj": [
            ("alvaress – Agente para OpenCode", "github.com/Alvarez-P/alvaress",
             "Creé un harness/agente para OpenCode que integra un modelo de decisión local para enrutar tareas y "
             "reducir el consumo de tokens (basado en el modelo Laya de Hugging Face), con flujos SDD/ODD, "
             "auditoría y validación automática. Además de un flujo para los agentes implementadores basados en "
             "como funciona Aider."),
            ("tickets-handler – En desarrollo", "NestJS · DDD",
             "Sistema de tickets con DDD, CQRS (PostgreSQL para escritura, Elasticsearch para lectura), "
             "arquitectura orientada a eventos (Kafka/RabbitMQ) y clasificación de tickets con IA."),
            ("Kopere – En desarrollo", "NestJS · Prisma · React PWA",
             "PWA para organizadores de tandas y préstamos personales; monorepo pnpm con backend NestJS, "
             "frontend y paquete compartido, probado con Vitest."),
        ],
        "edu": [("Instituto Tecnológico de Mérida – Ingeniería en Sistemas Computacionales", "2017 – 2021"),
                ("CONALEP Plantel Mérida I – Profesional Técnico Bachiller en Informática", "2014 – 2017")],
        "langs": ["Español: nativo",
                  "Inglés: B2 (TOEFL). Lectura y escritura técnica sólida; conversación oral en desarrollo."],
    },
    "en": {
        "lang": "en",
        "title": "Senior Backend Engineer | Full Stack Developer",
        "keywords": "Node.js · TypeScript · NestJS · React · Next.js · AWS · Microservices · DDD",
        "location": "Mérida, Yucatán, Mexico · Available",
        "h": {"summary": "Summary", "skills": "Skills", "exp": "Experience", "proj": "Projects",
              "edu": "Education", "lang": "Languages"},
        "summary": (
            "Computer Systems Engineer with <b>6+ years</b> of Full Stack experience, senior in "
            "<b>backend with Node.js, TypeScript and NestJS</b> and cloud architectures on <b>AWS</b> "
            "(Serverless, AWS CDK). I design <b>microservices</b>, Clean Architecture and DDD systems; "
            "junior/mid-level in frontend with React and Next.js. AI-assisted development using <b>SDD</b> and "
            "<b>ODD</b> depending on change size, plus in-house tooling to cut token usage. Experience in "
            "telecommunications, hospitality, logistics, education and HR."
        ),
        "skills": [
            ("Languages", "TypeScript, JavaScript, Node.js, Python, Java. Learning: Go"),
            ("Backend", "NestJS, Express, HapiJS, Restify, REST, GraphQL, WebSockets, JWT, OAuth, OpenAPI"),
            ("Frontend", "React, Next.js, HTML5, CSS3, Tailwind CSS, Zustand (junior/mid level)"),
            ("Architecture", "Microservices, Clean Architecture, DDD, SOLID, Serverless, "
                             "event-driven architecture, CQRS"),
            ("Databases", "PostgreSQL, PostGIS, MySQL, MongoDB, DynamoDB, Redis. "
                          "ORMs: Prisma, TypeORM, Drizzle, Sequelize, Mongoose"),
            ("Cloud (AWS)", "Lambda, API Gateway, S3, SNS, Step Functions, CloudWatch, "
                            "EC2, VPC, RDS, IAM, AWS CDK. Learning: Terraform, Kubernetes"),
            ("Messaging", "Kafka, RabbitMQ"),
            ("DevOps / CI-CD", "Docker, Docker Compose, Bitbucket Pipelines, GitHub Actions, GitLab, Git/Gitflow, "
                               "Grafana, CloudWatch"),
            ("Testing", "Jest, Vitest, Supertest, Mocha"),
            ("Applied AI", "Claude Code, OpenCode, GitHub Copilot, n8n, SDD, ODD. "
                           "Learning: RAG, LangChain, embeddings, vector databases, LLM workflows."),
            ("Practices", "Code reviews, technical mentoring, Scrum/Agile, estimation, performance optimization"),
        ],
        "exp": [
            ("INFOTEC – Senior Backend Engineer", "May 2023 – Mar 2026",
             "National Internet para Todos platform (CFE Telecomunicaciones) managing the logistics operation of "
             "connectivity infrastructure across Mexico: suppliers, contracts, materials, installation sites, "
             "photo evidence and operational tracking.",
             ["Sole backend developer on a team of 3; in the last year, became the person responsible for the "
              "projects, repositories and coordination with analysis and DevOps.",
              "Designed the backend architecture with Clean Architecture and <b>10+ microservices</b> "
              "(authentication, users, logistics, installations, among others) and built virtually all of the "
              "backend with NestJS.",
              "Platform with <b>118,174+ internet points</b> registered and operating (4G, satellite, fiber and "
              "copper), published on two public maps using geometric data types: "
              "mapa.internetparatodos.cfe.mx and cabinas.internetparatodos.cfe.mx.",
              "Designed REST APIs consumed by web and mobile apps (administrative staff and installers).",
              "Implemented file uploads, Excel/PDF reports and email notifications.",
              "Contributed to the frontend with React and Next.js (administrative modules).",
              "Defined development standards, ran code reviews and technical mentoring, and took part in "
              "estimation and architecture decisions."],
             "Node.js, TypeScript, NestJS, PostgreSQL, PostGIS, React, Next.js, AWS, Docker, JWT, Microservices"),
            ("HAPPYGUEST – Backend & Cloud Engineer", "Feb 2022 – Jan 2023",
             "Multitenant PMS for 4- and 5-star hotels (administration, restaurants, events and amenities) "
             "serving <b>50+ hotels</b> in Mexico.",
             ["Migrated <b>80+ Lambda functions</b> from JavaScript to TypeScript within the first two weeks.",
              "Migrated infrastructure from Serverless Framework to <b>AWS CDK</b>: learned the tool in the first "
              "week and owned the setup of everything already in production, as well as deployments.",
              "Built and deployed <b>100+ Lambdas</b>; introduced Lambda Layers to remove duplicated dependencies "
              "and speed up deployments.",
              "Designed the full guest event-booking module and serverless flows "
              "(API Gateway, Lambda, DynamoDB, EventBridge, SNS) for push-notification reminders.",
              "Built reports integrating Zendesk, Grafana and internal services; used CloudWatch and Grafana "
              "for log analysis.",
              "Took part in cloud architecture decisions and code reviews with the project lead."],
             "AWS CDK, Lambda, API Gateway, DynamoDB, SNS, EventBridge, CloudWatch, RDS MySQL, TypeScript, "
             "Bitbucket Pipelines"),
            ("DERBY TECHNOLOGIES – Backend Developer", "Nov 2021 – Jan 2022",
             "REST APIs and new features for a logistics platform, under Scrum.",
             [], "Node.js, Restify, AWS, MongoDB"),
            ("BELIEFF – Backend Developer Intern", "Mar 2020 – Oct 2021",
             "Backend for a dynamic survey platform for recruiting (HR), under Scrum; first professional "
             "exposure to DynamoDB and AWS.",
             [], "Node.js, AWS, DynamoDB"),
            ("ADC – Software Engineer & Technical Instructor", "2018 – Present (intermittent)",
             "Joined through a company-sponsored technical training program for high-performing students; later "
             "worked on real client projects and trained new developers.",
             ["Backend for education, CRM, dashboards and enterprise platforms: REST APIs, GraphQL and WebSockets.",
              "Educational SaaS for course, assignment and grade management.",
              "Performance tuning with raw SQL instead of an ORM when the project required it."],
             "Node.js, TypeScript, NestJS, Express, HapiJS, GraphQL, PostgreSQL, MongoDB, AWS Lambda, S3"),
            ("Independent – Personal projects and consulting", "2026 – Present",
             "Technical consulting and personal projects (see Projects section).",
             [], None),
        ],
        "proj": [
            ("alvaress – OpenCode agent", "github.com/Alvarez-P/alvaress",
             "Built an OpenCode agent/harness that embeds a local decision model to route tasks and cut token "
             "usage (based on the Laya model from Hugging Face), with SDD/ODD flows, auditing and automatic "
             "validation. Plus a workflow for implementer agents modeled on how Aider works."),
            ("tickets-handler – In progress", "NestJS · DDD",
             "Ticketing system with DDD, CQRS (PostgreSQL for writes, Elasticsearch for reads), event-driven "
             "architecture (Kafka/RabbitMQ) and AI-based ticket classification."),
            ("Kopere – In progress", "NestJS · Prisma · React PWA",
             "PWA for rotating-savings (tanda) and personal-loan organizers; pnpm monorepo with a NestJS backend, "
             "frontend and shared package, tested with Vitest."),
        ],
        "edu": [("Instituto Tecnológico de Mérida – B.Eng. Computer Systems Engineering", "2017 – 2021"),
                ("CONALEP Plantel Mérida I – Technical Baccalaureate in Computer Science", "2014 – 2017")],
        "langs": ["Spanish: native",
                  "English: B2 (TOEFL). Strong technical reading and writing; spoken conversation in progress."],
    },
}


def render(c):
    e = escape
    h = c["h"]
    links = " | ".join(f'<a href="{u}">{n}: {u.removeprefix("https://www.").removeprefix("https://")}</a>'
                       for n, u in LINKS.items())
    parts = [
        f'<h1>ADOLFO ESTEBAN ÁLVAREZ PACHECO</h1><div class="title">{e(c["title"])}</div>',
        f'<div>{e(c["keywords"])}</div>',
        f'<div class="contact">{e(c["location"])} | <a href="mailto:{EMAIL}">{EMAIL}</a> | +52 9999474365</div>',
        f'<div>{links}</div>',
        f'<h2>{h["summary"]}</h2><p>{c["summary"]}</p>',
        f'<h2>{h["skills"]}</h2><div class="sk">'
        + "".join(f"<p><b>{e(k)}:</b> {e(v)}</p>" for k, v in c["skills"]) + "</div>",
        f'<h2>{h["exp"]}</h2>',
    ]
    for name, dates, desc, bullets, tech in c["exp"]:
        parts.append(f'<h3><span>{e(name)}</span><span class="d">{e(dates)}</span></h3><p>{desc}</p>')
        if bullets:
            parts.append("<ul>" + "".join(f"<li>{b}</li>" for b in bullets) + "</ul>")
        if tech:
            lab = "Tecnologías" if c["lang"] == "es" else "Technologies"
            parts.append(f'<p class="tech"><b>{lab}:</b> {e(tech)}</p>')
    parts.append(f'<h2>{h["proj"]}</h2>')
    for name, sub, desc in c["proj"]:
        parts.append(f'<h3><span>{e(name)}</span><span class="d">{e(sub)}</span></h3><p>{e(desc)}</p>')
    parts.append(f'<h2>{h["edu"]}</h2>')
    for name, dates in c["edu"]:
        parts.append(f'<h3><span>{e(name)}</span><span class="d">{e(dates)}</span></h3>')
    parts.append(f'<h2>{h["lang"]}</h2>' + "".join(f"<p>{e(x)}</p>" for x in c["langs"]))
    return (f'<html lang="{c["lang"]}"><head><meta charset="utf-8"><title>CV - Adolfo Esteban Álvarez Pacheco'
            f'</title><style>{CSS}</style></head><body>' + "".join(parts) + "</body></html>")


if __name__ == "__main__":
    for key, c in CONTENT.items():
        out = OUT / f"CV-Esteban-Alvarez-{key.upper()}.pdf"
        HTML(string=render(c)).write_pdf(out)
        print(out)
