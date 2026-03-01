---
title: "Installing Frappe/ERPNext (Docker Method)"
date: 2025-08-11
tags: ["ERPNext", "Frappe", "Docker", "Installation"]
description: "A step-by-step guide to installing Frappe and ERPNext using Docker and Docker Compose."
---

## Why Docker?
Docker simplifies deployment, ensures consistent environments, and makes scaling easier.

## Installation Steps
```bash
# Install Docker & Docker Compose
sudo apt update && sudo apt install docker.io docker-compose -y

# Clone ERPNext Docker repository
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker

# Copy example environment
cp .env-example .env

# Start containers
docker-compose up -d

# Access logs
docker-compose logs -f
```

## Accessing ERPNext
- **Site URL:** http://localhost:8080
- Default admin credentials will be set during the site creation process.

---
**Next Article →** [First Steps in Frappe](05-first-steps-frappe.md)


---