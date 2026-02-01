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

# ======================
# 1️⃣ Install Nginx
# ======================
echo "=== Installing Nginx ==="
sudo apt update -y
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# ======================
# 2️⃣ Configure UFW (Firewall)
# ======================
echo "=== Configuring UFW ==="
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw --force enable

# ======================
# 3️⃣ Create Nginx Config
# ======================
echo "=== Creating Nginx config ==="
sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null <<EOF
# Redirect all HTTP traffic to HTTPS
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server block
server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:$BACKEND_PORT/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend proxy
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

# ======================
# 4️⃣ Enable site & remove default
# ======================
echo "=== Enabling Nginx site ==="
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/$PROJECT_NAME
sudo rm -f /etc/nginx/sites-enabled/default

# ======================
# 5️⃣ Test & reload Nginx
# ======================
echo "=== Testing Nginx config ==="
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
echo "=== Requesting Let’s Encrypt SSL ==="
sudo certbot --nginx -d $DOMAIN --redirect --agree-tos --non-interactive -m $EMAIL

# ======================
# 8️⃣ Test renewal
# ======================
echo "=== Testing SSL renewal ==="
sudo certbot renew --dry-run

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
