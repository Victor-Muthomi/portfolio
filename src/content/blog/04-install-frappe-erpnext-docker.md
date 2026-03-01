---
title: "Installing Frappe/ERPNext (Docker Method)"
date: 2025-08-11
author: "Victor"
tags: ["ERPNext", "Frappe", "Docker", "Installation"]
category: "Frappe/ERPNext"
excerpt: "A complete, step-by-step guide to installing Frappe and ERPNext using Docker and Docker Compose — covering prerequisites, site creation, SSL, and common troubleshooting tips."
---

## Why Docker?

Docker packages every dependency — Python, Node.js, MariaDB, Redis, and Nginx — into isolated containers, eliminating the classic "works on my machine" problem. Compared to the native installation method, the Docker approach offers:

- **Reproducibility** — identical environment on every machine.
- **Faster setup** — no manual dependency configuration.
- **Easy upgrades** — pull a new image instead of re-running install scripts.
- **Portability** — deploy the same stack on a laptop, a VPS, or a cloud VM.

## Prerequisites

Before you begin, ensure the following are installed and running:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| Docker Engine | 24+ | `docker --version` |
| Docker Compose v2 | 2.20+ | `docker compose version` |
| Git | Any recent | `git --version` |
| RAM | 4 GB free | `free -h` |
| Disk | 10 GB free | `df -h` |

> **Note:** The official Frappe Docker setup uses `docker compose` (v2, no hyphen). If you only have the older `docker-compose` (v1) command, upgrade Docker Desktop or install the Compose plugin separately.

## Step 1 — Install Docker

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Allow running Docker without sudo
sudo usermod -aG docker $USER
newgrp docker
```

Verify:

```bash
docker --version          # Docker version 24.x.x
docker compose version    # Docker Compose version v2.x.x
```

## Step 2 — Clone the Frappe Docker Repository

```bash
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker
```

The repository contains pre-built `docker-compose` files for different scenarios:

| File | Purpose |
|---|---|
| `compose.yaml` | Core services (backend, frontend, db, redis…) |
| `overrides/compose.mariadb.yaml` | Use MariaDB (recommended) |
| `overrides/compose.proxy.yaml` | Traefik reverse proxy for multi-site |
| `overrides/compose.https.yaml` | Automatic HTTPS via Let's Encrypt |

## Step 3 — Configure the Environment

```bash
cp example.env .env
```

Open `.env` in your editor and set the key variables:

```bash
# ERPNext version to use
ERPNEXT_VERSION=version-15

# Database root password — change this!
DB_PASSWORD=your_strong_password

# Your site name (used as hostname and internal key)
SITE_NAME=mysite.localhost
```

## Step 4 — Start the Containers

For a standard single-site development setup with MariaDB:

```bash
docker compose \
  --project-name frappe \
  -f compose.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.noproxy.yaml \
  up -d
```

This pulls all required images and starts the following services in the background:

- `backend` — Frappe/ERPNext Python process (gunicorn)
- `frontend` — Nginx serving the JS/CSS assets
- `websocket` — Socket.io server for real-time features
- `queue-short`, `queue-long` — Background job workers (RQ)
- `scheduler` — Frappe task scheduler
- `db` — MariaDB database server
- `redis-cache`, `redis-queue` — Redis instances

Check that all containers are healthy:

```bash
docker compose --project-name frappe ps
```

## Step 5 — Create a New Site

```bash
docker compose \
  --project-name frappe \
  exec backend \
  bench new-site mysite.localhost \
  --mariadb-root-password your_strong_password \
  --admin-password admin \
  --install-app erpnext
```

This command:
1. Creates a new MariaDB database for `mysite.localhost`
2. Runs all Frappe and ERPNext database migrations
3. Installs the ERPNext app onto the site
4. Sets the administrator password

The process takes 3–10 minutes depending on your machine.

## Step 6 — Access ERPNext

Add a local DNS entry so your browser can resolve the site name:

```bash
echo "127.0.0.1  mysite.localhost" | sudo tee -a /etc/hosts
```

Then open **http://mysite.localhost:8080** in your browser.

Default login:
- **Username:** `Administrator`
- **Password:** the `--admin-password` value you used above (`admin`)

## Step 7 — Enable HTTPS (Optional, Production)

For a publicly accessible server, enable automatic HTTPS with Traefik:

1. Point your domain DNS A record to your server's IP.
2. Update `.env`:

```bash
LETSENCRYPT_EMAIL=you@example.com
SITE_NAME=erp.yourdomain.com
```

3. Restart with the HTTPS override:

```bash
docker compose \
  --project-name frappe \
  -f compose.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.proxy.yaml \
  -f overrides/compose.https.yaml \
  up -d
```

Traefik automatically obtains and renews the Let's Encrypt certificate.

## Common Management Commands

```bash
# View real-time logs for all services
docker compose --project-name frappe logs -f

# View logs for a specific service
docker compose --project-name frappe logs -f backend

# Restart a single service
docker compose --project-name frappe restart backend

# Run bench commands inside the container
docker compose --project-name frappe exec backend bench --help

# Take a site backup
docker compose --project-name frappe exec backend \
  bench --site mysite.localhost backup

# Update ERPNext to the latest patch
docker compose --project-name frappe pull
docker compose --project-name frappe up -d

# Stop all containers (data is preserved in volumes)
docker compose --project-name frappe down

# Stop and remove volumes (⚠ destroys all data)
docker compose --project-name frappe down -v
```

## Troubleshooting

### Containers exit immediately

```bash
docker compose --project-name frappe logs backend
```

A common cause is an incorrect `DB_PASSWORD` in `.env` that doesn't match what MariaDB was initialised with. If you changed it after first run, remove the db volume and re-create:

```bash
docker compose --project-name frappe down -v
docker compose --project-name frappe up -d
# Then re-run Step 5
```

### Site not reachable on port 8080

Check that the `frontend` container is running and port 8080 is not blocked:

```bash
docker compose --project-name frappe ps frontend
sudo ufw allow 8080
```

### `bench new-site` hangs at migrations

This is usually a resource issue. Ensure you have at least 4 GB RAM free. You can monitor container resource usage with:

```bash
docker stats
```

### Permission denied on Docker socket

If you get `permission denied while trying to connect to the Docker daemon socket`, either prefix commands with `sudo` or re-run `newgrp docker` after adding yourself to the `docker` group.

## Summary

| Step | Command |
|---|---|
| Install Docker | `apt install docker-ce docker-compose-plugin` |
| Clone repo | `git clone https://github.com/frappe/frappe_docker` |
| Configure | `cp example.env .env` |
| Start services | `docker compose -f compose.yaml … up -d` |
| Create site | `bench new-site … --install-app erpnext` |
| Open browser | http://mysite.localhost:8080 |

---

**Next Article →** [First Steps in Frappe](/blog/05-first-steps-frappe)

**Previous Article ←** [Installing Frappe/ERPNext (Native Method)](/blog/03-install-frappe-erpnext-native)

**Related:**
- [What is Frappe?](/blog/01-what-is-frappe)
- [What is ERPNext?](/blog/02-what-is-erpnext)


---