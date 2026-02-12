# Nginx & SSL Setup for MERN App

This guide explains how to automatically install Nginx, configure it as a reverse proxy for a MERN app, enable HTTPS with Certbot, and configure the firewall.

---

## Overview

This script performs the following steps:

1. Install Nginx
2. Create `/etc/nginx/sites-available/mern-app`
3. Enable the site
4. Test & reload Nginx
5. Install Certbot
6. Configure UFW (firewall)
7. Request SSL for `bulsujuans.xyz`

---

## Step 1 — Create the Script

```bash
sudo mkdir -p /opt/scripts
sudo nano /opt/scripts/setup-nginx-ssl.sh
```

---

## Step 2 — Paste the Script

```bash
#!/bin/bash
set -e

# ======================
# VARIABLES
# ======================
PROJECT_NAME="bulsujuans-mern-app"
DOMAIN="bulsujuans.xyz"
FRONTEND_PORT=3001
BACKEND_PORT=4001
EMAIL="jhondeldelconacaranay@gmail.com"

NGINX_AVAILABLE="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"

echo "=============================="
echo "🚀 Setting up Nginx + SSL"
echo "=============================="

# ======================
# 1️⃣ Install Nginx
# ======================
echo "=== Installing Nginx ==="
sudo apt update -y
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# ======================
# 2️⃣ Configure Firewall
# ======================
echo "=== Configuring UFW ==="
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# ======================
# 3️⃣ Create HTTP-only Nginx Config
# ======================
echo "=== Creating HTTP Nginx config ==="

sudo tee $NGINX_AVAILABLE > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:$BACKEND_PORT/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

# ======================
# 4️⃣ Enable Site
# ======================
echo "=== Enabling Nginx site ==="
sudo ln -sf $NGINX_AVAILABLE $NGINX_ENABLED
sudo rm -f /etc/nginx/sites-enabled/default

# ======================
# 5️⃣ Test & Reload Nginx
# ======================
echo "=== Testing Nginx (HTTP) ==="
sudo nginx -t
sudo systemctl reload nginx

# ======================
# 6️⃣ Install Certbot
# ======================
echo "=== Installing Certbot ==="
sudo apt install certbot python3-certbot-nginx -y

# ======================
# 7️⃣ Request SSL Certificate
# ======================
echo "=== Requesting SSL from Let's Encrypt ==="
sudo certbot --nginx \
    -d $DOMAIN \
    --redirect \
    --agree-tos \
    --non-interactive \
    -m $EMAIL

# ======================
# 8️⃣ Reload Nginx
# ======================
echo "=== Reloading Nginx (HTTPS) ==="
sudo nginx -t
sudo systemctl reload nginx

# ======================
# 9️⃣ Test Auto Renewal
# ======================
echo "=== Testing SSL Auto-Renewal ==="
sudo certbot renew --dry-run

echo "=============================="
echo "✅ SETUP COMPLETE"
echo "=============================="
echo "🌐 Your app is live at:"
echo "👉 https://$DOMAIN"

```

Save and exit:

- `CTRL + O`
- `ENTER`
- `CTRL + X`

---

## Step 3 — Make It Executable

```bash
sudo chmod +x setup-nginx-ssl.sh
sudo chmod +x /opt/scripts/setup-nginx-ssl.sh
```

---

## Step 4 — Run the Script

```bash
sudo /opt/scripts/setup-nginx-ssl.sh
```

That's it. No extra steps.

---

## Required Before Running

These must be true or SSL will fail:

- `dig bulsujuans.xyz` must return your EC2 public IP

---

## Result

✅ Nginx installed

✅ Reverse proxy working

✅ HTTPS enabled

✅ Firewall configured

✅ Production-ready setup

---
