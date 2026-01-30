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
7. Request SSL for `bulsujuans.jhondel-mern-app.com`

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
DOMAIN="bulsujuans.jhondel-mern-app.com"
FRONTEND_PORT=3001
BACKEND_PORT=4001


echo "=== 1. Install Nginx ==="
sudo apt update -y
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# ============================================
# NOTE: Trailing Slash in proxy_pass Matters
# ============================================
# 1️⃣ Without trailing slash:
#    proxy_pass http://localhost:$BACKEND_PORT;
#    - Preserves the matched location path (/api/) when forwarding.
#    - /api/users -> http://localhost:4000/api/users
#    - Correct for our backend because we mount routes under /api in Express.
#
# 2️⃣ With trailing slash:
#    proxy_pass http://localhost:$BACKEND_PORT/;
#    - Strips the matched location path (/api/) from the request.
#    - /api/users -> http://localhost:4000/users
#    - Would break our backend routes, since /api prefix is removed.
#
#    For this project, always use proxy_pass WITHOUT trailing slash
#    to ensure frontend /api calls correctly reach backend /api endpoints.

echo "=== 2. Create Nginx config ==="
sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://localhost:$FRONTEND_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "=== 3. Enable Nginx site ==="
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/$PROJECT_NAME
sudo rm -f /etc/nginx/sites-enabled/default

echo "=== 4. Test & reload Nginx ==="
sudo nginx -t
sudo systemctl reload nginx

echo "=== 5. Install Certbot ==="
sudo apt install certbot python3-certbot-nginx -y

echo "=== 6. Configure UFW ==="
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable

echo "=== 7. Request SSL certificate ==="
sudo certbot --nginx -d $DOMAIN

echo "=== DONE ==="
echo "Your MERN app should now be available at:"
echo "https://$DOMAIN"
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
sudo ./setup-nginx-ssl.sh
sudo /opt/scripts/setup-nginx-ssl.sh
```

That's it. No extra steps.

---

## Required Before Running

These must be true or SSL will fail:

- `dig bulsujuans.jhondel-mern-app.com` must return your EC2 public IP
- `curl http://localhost:3000` and `curl http://localhost:4000` must succeed (frontend & backend must be running)

---

## Result

✅ Nginx installed

✅ Reverse proxy working

✅ HTTPS enabled

✅ Firewall configured

✅ Production-ready setup

---

## Next Steps (Optional)

- Convert this into GitHub Actions (manual trigger)
- Make frontend + API subdomains
- Adapt it for multiple MERN apps
