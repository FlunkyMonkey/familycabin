# FamilyCabin.io Installation Guide

This guide provides step-by-step instructions for installing and configuring the FamilyCabin.io application on an Ubuntu 22.04 server.

## Prerequisites

Before beginning the installation, ensure your server meets the following requirements:

- Ubuntu 22.04 LTS
- Root or sudo access
- Minimum 2GB RAM
- 10GB free disk space
- Internet connectivity

## System Dependencies

### Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Node.js and npm

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x.x
npm --version   # Should be 8.x.x or higher
```

### Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Reload local package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start and enable MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Install Git

```bash
sudo apt install -y git
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

## Application Setup

### 1. Create Application Directory

```bash
sudo mkdir -p /var/www/familycabin
sudo chown -R $USER:$USER /var/www/familycabin
```

### 2. Clone Repository

```bash
cd /var/www/familycabin
git clone https://github.com/yourusername/familycabin.git .
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm run install-all
```

### 4. Configure Environment Variables

```bash
# Create server .env file
cd /var/www/familycabin/server
cp .env.example .env

# Edit the .env file with your production settings
nano .env
```

Update the following variables in the .env file:

```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://localhost:27017/familycabin
JWT_SECRET=your_strong_random_secret_key
LOG_DIR=/var/log/familycabin
```

### 5. Create Log Directory

```bash
# Create log directory
sudo mkdir -p /var/log/familycabin
sudo chown -R $USER:$USER /var/log/familycabin
```

### 6. Build the Client

```bash
cd /var/www/familycabin
npm run build
```

### 7. Seed the Database

```bash
cd /var/www/familycabin
npm run seed
```

This will create the default admin account:
- Username: `admin`
- Password: `admin`

**Important**: Change these credentials immediately after first login.

## Configure Web Server

### Option 1: Using PM2 with Built-in Node.js Server

```bash
cd /var/www/familycabin
pm2 start server/src/index.js --name "familycabin"
pm2 save
pm2 startup
```

### Option 2: Using Nginx as a Reverse Proxy (Recommended)

#### Install Nginx

```bash
sudo apt install -y nginx
```

#### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/familycabin
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/familycabin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Configuration (Self-Signed Certificate)

```bash
# Install OpenSSL
sudo apt install -y openssl

# Generate self-signed certificate
sudo mkdir -p /etc/ssl/familycabin
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/familycabin/private.key -out /etc/ssl/familycabin/certificate.crt
```

Update Nginx configuration for HTTPS:

```bash
sudo nano /etc/nginx/sites-available/familycabin
```

Replace the configuration with:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/familycabin/certificate.crt;
    ssl_certificate_key /etc/ssl/familycabin/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable
```

## Setup Automatic Startup

Ensure the application starts automatically on system boot:

```bash
# If using PM2
pm2 startup
pm2 save

# If using systemd directly
sudo nano /etc/systemd/system/familycabin.service
```

For systemd, add the following content:

```
[Unit]
Description=FamilyCabin.io Application
After=network.target mongodb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/familycabin
ExecStart=/usr/bin/node server/src/index.js
Restart=on-failure
Environment=NODE_ENV=production PORT=4000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable familycabin
sudo systemctl start familycabin
```

## Monitoring and Logs

### Check Application Status

```bash
# If using PM2
pm2 status
pm2 logs familycabin

# If using systemd
sudo systemctl status familycabin
sudo journalctl -u familycabin
```

### View Application Logs

```bash
# Application logs
tail -f /var/log/familycabin/combined.log
tail -f /var/log/familycabin/error.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Database Backup

Create a script for regular MongoDB backups:

```bash
sudo nano /usr/local/bin/backup-familycabin.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/familycabin"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
mkdir -p $BACKUP_DIR
mongodump --db familycabin --out $BACKUP_DIR/$TIMESTAMP
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

Make the script executable and set up a cron job:

```bash
sudo chmod +x /usr/local/bin/backup-familycabin.sh
sudo crontab -e
```

Add the following line to run the backup daily at 2 AM:

```
0 2 * * * /usr/local/bin/backup-familycabin.sh
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Check if MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in .env file

2. **Application Not Starting**
   - Check logs: `tail -f /var/log/familycabin/error.log`
   - Verify Node.js version: `node --version`

3. **Nginx Configuration Issues**
   - Test configuration: `sudo nginx -t`
   - Check Nginx logs: `tail -f /var/log/nginx/error.log`

4. **Permission Issues**
   - Ensure correct ownership: `sudo chown -R $USER:$USER /var/www/familycabin`
   - Check log directory permissions: `sudo chown -R $USER:$USER /var/log/familycabin`

## Updating the Application

To update the application with the latest changes:

```bash
cd /var/www/familycabin
git pull
npm run install-all
npm run build

# Restart the application
pm2 restart familycabin
# OR
sudo systemctl restart familycabin
```

## Security Recommendations

1. **Change Default Admin Credentials**
   - Log in with username `admin` and password `admin`
   - Immediately change the password in the user profile section

2. **Secure MongoDB**
   - Enable authentication
   - Configure firewall to restrict access

3. **Regular Updates**
   - Keep Ubuntu updated: `sudo apt update && sudo apt upgrade`
   - Keep Node.js packages updated: `npm audit fix`

4. **Replace Self-Signed Certificate**
   - Consider using Let's Encrypt for a trusted SSL certificate
