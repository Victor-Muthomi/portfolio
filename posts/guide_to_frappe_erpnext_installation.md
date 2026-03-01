---
title: Comprehensive Guide To Frappe and ERPNext Installation - With D
date: 2025-08-30
author: Victor
tags: ERPNext, Frappe
category: Frappe Framework
excerpt: Learn how to build powerful web applications with Django, Python's most popular web framework. This guide covers installation, project setup, models, views, templates, and more.
---


# Complete Frappe & ERPNext Installation Guide

Welcome to the most comprehensive guide for installing Frappe and ERPNext! Whether you're a complete beginner or an experienced developer, this guide will walk you through every step of the installation process.

## 🎯 What You'll Learn

By the end of this guide, you'll have:
- A fully functional Frappe framework installation
- ERPNext up and running
- Understanding of the architecture
- Knowledge to troubleshoot common issues

## 📋 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04+ (recommended), Debian 10+, or macOS
- **RAM**: Minimum 4GB (8GB+ recommended for production)
- **Storage**: At least 10GB free space
- **Python**: 3.8+ (will be installed in this guide)
- **Node.js**: 18+ (will be installed)

### What is Frappe and ERPNext?
- **Frappe**: A full-stack web application framework written in Python and JavaScript
- **ERPNext**: An open-source ERP system built on the Frappe framework
- Think of Frappe as the foundation and ERPNext as the house built on top

## 🚀 Installation Methods

We'll cover three installation methods:
1. **Easy Install Script** (Recommended for beginners)
2. **Manual Installation** (For learning and customization)
3. **Docker Installation** (For development and testing)

---

## Method 1: Easy Install Script (Recommended)

This is the fastest way to get started and is perfect for beginners.

### Step 1: Update Your System
```bash
# Update package lists
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y
```

### Step 2: Install Git
```bash
sudo apt install git -y
```

### Step 3: Download and Run the Install Script
```bash
# Download the installation script
wget https://raw.githubusercontent.com/frappe/bench/develop/install.py

# Run the installation script
sudo python3 install.py --production --user $(whoami)
```

**What this script does:**
- Installs all required dependencies (Python, Node.js, MariaDB, etc.)
- Sets up the bench environment
- Creates a new site
- Installs ERPNext

### Step 4: Wait for Installation
The installation can take 15-30 minutes depending on your internet speed and system performance. Grab a coffee! ☕

### Step 5: Access Your ERPNext Installation
Once installation is complete:
```bash
# Start the development server
bench start
```

Open your browser and go to: `http://localhost:8000`

**Default credentials:**
- Username: `Administrator`
- Password: (You'll set this during the setup wizard)

---

## Method 2: Manual Installation (Detailed Learning Approach)

This method gives you complete control and understanding of each component.

### Step 1: Install System Dependencies

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Essential Packages
```bash
sudo apt install -y \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-distutils \
    software-properties-common \
    mariadb-server \
    mariadb-client \
    redis-server \
    xvfb \
    libfontconfig \
    wkhtmltopdf \
    libmysqlclient-dev \
    curl \
    build-essential \
    git
```

### Step 2: Install Node.js and npm
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install Yarn
```bash
sudo npm install -g yarn
```

### Step 4: Configure MariaDB
```bash
# Secure MariaDB installation
sudo mysql_secure_installation
```

**During the security setup:**
- Set root password: Choose a strong password
- Remove anonymous users: Y
- Disallow root login remotely: Y
- Remove test database: Y
- Reload privilege tables: Y

#### Configure MariaDB for Frappe
```bash
sudo mysql -u root -p
```

Execute these SQL commands:
```sql
-- Create the my.cnf configuration
```

Create the MariaDB configuration file:
```bash
sudo tee /etc/mysql/mariadb.conf.d/frappe.cnf > /dev/null <<EOF
[mysqld]
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[mysql]
default-character-set = utf8mb4
EOF
```

Restart MariaDB:
```bash
sudo systemctl restart mariadb
```

### Step 5: Install Bench
```bash
# Install bench using pip
sudo pip3 install frappe-bench

# Verify installation
bench --version
```

### Step 6: Initialize Bench
```bash
# Create a new bench directory
bench init frappe-bench

# Change to the bench directory
cd frappe-bench
```

**What happened here:**
- Created a new directory structure
- Set up virtual environment
- Downloaded Frappe framework

### Step 7: Create a New Site
```bash
# Create a new site (replace 'mysite.local' with your preferred name)
bench new-site mysite.local

# You'll be prompted to set:
# - MariaDB root password
# - Administrator password for the site
```

### Step 8: Install ERPNext
```bash
# Download ERPNext app
bench get-app erpnext

# Install ERPNext on your site
bench --site mysite.local install-app erpnext
```

### Step 9: Start the Development Server
```bash
# Start all services
bench start
```

Access your installation at: `http://mysite.local:8000`

**Note**: You may need to add `127.0.0.1 mysite.local` to your `/etc/hosts` file.

---

## Method 3: Docker Installation (Development & Testing)

Perfect for development environments and quick testing.

### Step 1: Install Docker and Docker Compose
```bash
# Install Docker
sudo apt install docker.io docker-compose -y

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
```

### Step 2: Clone ERPNext Docker Repository
```bash
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker
```

### Step 3: Copy Environment File
```bash
cp example.env .env
```

### Step 4: Edit Environment Variables (Optional)
```bash
nano .env
```

Key variables to consider:
- `ERPNEXT_VERSION=version-14` (or latest)
- `FRAPPE_VERSION=version-14`

### Step 5: Start the Containers
```bash
# Start in development mode
docker-compose -f compose.yaml -f overrides/compose.noproxy.yaml -f overrides/compose.erpnext.yaml up -d

# Or for a simpler setup
docker-compose up -d
```

### Step 6: Create a New Site
```bash
# Execute into the backend container
docker exec -it frappe_docker_erpnext-python_1 bash

# Create a new site
bench new-site frontend --mariadb-root-password admin --admin-password admin

# Install ERPNext
bench --site frontend install-app erpnext
```

Access at: `http://localhost:8080`

---

## 🛠 Post-Installation Configuration

### Setting Up Development Environment

#### Enable Developer Mode
```bash
# Navigate to your bench directory
cd frappe-bench

# Enable developer mode for your site
bench --site mysite.local set-config developer_mode 1

# Clear cache
bench --site mysite.local clear-cache
```

#### Install Additional Useful Apps
```bash
# Frappe Insights (Business Intelligence)
bench get-app insights
bench --site mysite.local install-app insights

# Frappe HR
bench get-app hrms
bench --site mysite.local install-app hrms
```

### Production Setup (Advanced)

#### Set Up Nginx and Supervisor
```bash
# Install nginx and supervisor
sudo apt install nginx supervisor -y

# Setup production configuration
sudo bench setup production $(whoami)

# Enable and start services
sudo systemctl enable nginx
sudo systemctl enable supervisor
```

#### Enable SSL (Optional but Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Essential Bench Commands

Here are the most important commands you'll use regularly:

### Site Management
```bash
# Create a new site
bench new-site sitename

# Drop a site (be careful!)
bench drop-site sitename

# Backup a site
bench --site sitename backup

# Restore from backup
bench --site sitename restore /path/to/backup.sql
```

### App Management
```bash
# Get an app from GitHub
bench get-app appname

# Install app on a site
bench --site sitename install-app appname

# Uninstall app from site
bench --site sitename uninstall-app appname

# Update all apps
bench update
```

### Development Commands
```bash
# Start development server
bench start

# Watch for changes and rebuild
bench watch

# Run in console mode
bench --site sitename console

# Clear cache
bench --site sitename clear-cache

# Migrate database
bench --site sitename migrate
```

### System Commands
```bash
# Restart all services
bench restart

# Update bench itself
bench update

# Switch to a specific branch
bench switch-to-branch version-14

# Setup production
sudo bench setup production username
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Permission Denied Errors
```bash
# Fix ownership issues
sudo chown -R $(whoami):$(whoami) /path/to/frappe-bench

# Fix permissions
sudo chmod -R 755 /path/to/frappe-bench
```

### Issue 2: MariaDB Connection Issues
```bash
# Check MariaDB status
sudo systemctl status mariadb

# Restart MariaDB
sudo systemctl restart mariadb

# Check MariaDB logs
sudo tail -f /var/log/mysql/error.log
```

### Issue 3: Port Already in Use
```bash
# Check what's using port 8000
sudo lsof -i :8000

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or use a different port
bench start --port 8001
```

### Issue 4: Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node modules
cd frappe-bench/apps/frappe
npm install

# If you get permission errors
sudo chown -R $(whoami) ~/.npm
```

### Issue 5: Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Restart Redis
sudo systemctl restart redis-server

# Test Redis connection
redis-cli ping
```

---

## 🎨 Customization and Development

### Creating Your First Custom App
```bash
# Create a new app
bench new-app myapp

# Install it on your site
bench --site mysite.local install-app myapp
```

### Understanding the Directory Structure
```
frappe-bench/
├── apps/                 # All Frappe apps
│   ├── frappe/          # Core Frappe framework
│   ├── erpnext/         # ERPNext application
│   └── myapp/           # Your custom apps
├── sites/               # Site-specific files
│   ├── mysite.local/    # Your site directory
│   └── common_site_config.json
├── config/              # Configuration files
├── logs/                # Log files
└── env/                 # Python virtual environment
```

### Development Best Practices
1. **Always work in developer mode** for custom development
2. **Use version control** for your custom apps
3. **Follow Frappe's coding standards**
4. **Test thoroughly** before deploying to production
5. **Keep regular backups**

---

## 🔒 Security Best Practices

### For Development
- Never use default passwords
- Keep your system updated
- Use strong administrator passwords
- Enable firewall if needed

### For Production
- Set up SSL certificates
- Configure proper firewall rules
- Regular security updates
- Monitor logs regularly
- Set up automated backups

---

## 📊 Performance Optimization

### Basic Optimizations
```bash
# Enable production mode
bench --site mysite.local set-config developer_mode 0

# Clear cache
bench --site mysite.local clear-cache

# Optimize database
bench --site mysite.local optimize-database
```

### Advanced Optimizations
- Configure Redis properly
- Set up proper caching
- Optimize MariaDB configuration
- Use a CDN for static files
- Implement proper monitoring

---

## 🆘 Getting Help

### Official Resources
- **Documentation**: https://frappeframework.com/docs
- **ERPNext Documentation**: https://docs.erpnext.com
- **Community Forum**: https://discuss.frappe.io
- **GitHub Issues**: 
  - Frappe: https://github.com/frappe/frappe
  - ERPNext: https://github.com/frappe/erpnext

### Community Support
- Join the Frappe Discord server
- Follow Frappe on Twitter
- Check Stack Overflow for common issues

### Professional Support
- Frappe Cloud (hosted solution)
- Certified Frappe Partners
- Custom development services

---

## 🎉 Next Steps

Congratulations! You now have Frappe and ERPNext installed. Here's what to do next:

### For Beginners
1. **Complete the Setup Wizard**: Set up your company, chart of accounts, and basic settings
2. **Explore the User Interface**: Navigate through different modules
3. **Try Basic Operations**: Create customers, items, and sales invoices
4. **Watch Tutorials**: Check out ERPNext's YouTube channel
5. **Join the Community**: Ask questions on the forum

### For Developers
1. **Study the Framework**: Understand DocTypes, Controllers, and Hooks
2. **Create Custom Apps**: Build your first custom application
3. **Learn the API**: Explore REST and RPC APIs
4. **Contribute**: Fix bugs or add features to the core
5. **Build Solutions**: Create industry-specific customizations

### Production Deployment
1. **Security Hardening**: Implement proper security measures
2. **Performance Tuning**: Optimize for your specific use case
3. **Monitoring Setup**: Implement logging and monitoring
4. **Backup Strategy**: Set up automated backups
5. **Update Process**: Plan for regular updates

---

## 🔄 Maintenance Commands

### Daily Operations
```bash
# Check site status
bench doctor

# Update all apps
bench update

# Backup important sites
bench --site mysite.local backup --with-files
```

### Weekly Maintenance
```bash
# Clear old logs
bench clear-cache
bench --site mysite.local clear-website-cache

# Optimize database
bench --site mysite.local optimize-database

# Check for security updates
sudo apt update && sudo apt list --upgradable
```

---

## 🎯 Quick Reference

### Most Used Commands
| Command | Description |
|---------|-------------|
| `bench start` | Start development server |
| `bench restart` | Restart all services |
| `bench update` | Update all apps |
| `bench migrate` | Run database migrations |
| `bench console` | Open Python console |
| `bench clear-cache` | Clear all caches |

### Important File Locations
| File/Directory | Purpose |
|----------------|---------|
| `sites/site.local/site_config.json` | Site configuration |
| `sites/common_site_config.json` | Common configuration |
| `logs/` | Application logs |
| `config/supervisor.conf` | Supervisor configuration |

---

## 💡 Pro Tips

### For Beginners
- **Start Small**: Don't try to configure everything at once
- **Use the Forum**: The community is very helpful
- **Follow Tutorials**: Video tutorials are great for visual learners
- **Practice**: Set up a development environment to experiment

### For Advanced Users
- **Custom Apps**: Learn to create custom applications
- **API Integration**: Explore integration possibilities
- **Performance**: Monitor and optimize performance
- **Automation**: Use hooks and scheduled jobs effectively

---

## 🚨 Important Notes

### Data Safety
- **Always backup** before major changes
- **Test in development** before applying to production
- **Version control** your customizations

### Updates
- **Read release notes** before updating
- **Test updates** in a staging environment
- **Plan downtime** for production updates

### Support
- **Community first**: Try the forum before paid support
- **Document issues**: Provide detailed error messages
- **Version info**: Always mention your Frappe/ERPNext versions

---

## 🎊 Conclusion

You've successfully installed Frappe and ERPNext! This is just the beginning of your journey with this powerful framework. Whether you're planning to use ERPNext for your business or develop custom applications on Frappe, you now have a solid foundation to build upon.

Remember:
- **Take it step by step** - Don't rush the learning process
- **Experiment safely** - Use development environments for testing
- **Engage with the community** - The Frappe community is welcoming and helpful
- **Keep learning** - Both frameworks are constantly evolving

Happy coding, and welcome to the Frappe family! 🎉

---

*Last updated: August 2025*
*Guide maintained by the Frappe community*