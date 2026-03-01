---
title: "Installing Frappe/ERPNext (Native Method)"
date: 2025-08-11
author: Victor
tags: ERPNext, Frappe, Installation, Ubuntu, Linux
category: Frappe/ERPNext
excerpt: "Step-by-step guide to installing Frappe and ERPNext using the native method."
---

## Prerequisites
- Ubuntu 22.04 LTS (recommended)
- Python 3.10+
- Node.js 16+
- Redis, MariaDB, wkhtmltopdf

## Installation Steps
```bash
# Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-dev libmariadb-dev libxslt1-dev redis-server nodejs npm wkhtmltopdf -y

# Install bench
pip install frappe-bench

# Create a new bench instance
bench init my-bench --frappe-branch version-15

# Create a site
cd my-bench
bench new-site mysite.local

# Get ERPNext
bench get-app erpnext --branch version-15

# Install ERPNext on site
bench --site mysite.local install-app erpnext

# Start server
bench start
```
---
**Next Article →** [Installing Frappe/ERPNext (Docker Method)](/blog/04-install-frappe-erpnext-docker)


---