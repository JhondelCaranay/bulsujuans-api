# 🚀 Production Nginx + SSL Setup for MERN (10/10)

This document provides a **production‑grade**, **hardened**, and **fully automated** setup for deploying a MERN application behind **Nginx** with **HTTPS (Let’s Encrypt)** on **Ubuntu / AWS EC2**.

---

## ✅ What This Setup Does

- Installs and configures **Nginx** as a reverse proxy
- Proxies **Frontend (React)** and **Backend (Node/Express)**
- Supports **Socket.IO**
- Issues and configures **SSL via Certbot**
- Forces **HTTPS**
- Adds **security headers**
- Configures firewall **safely**
- Validates **DNS before SSL issuance**
- Verifies **auto‑renewal**

---

## 🧱 Architecture Overview

```
Internet
   ↓
HTTPS (443)
   ↓
Nginx (Reverse Proxy)
   ├── /        → React Frontend (PORT 3001)
   ├── /api     → Node API (PORT 4001)
   └── /socket  → Socket.IO (PORT 4001)
```

---

## 🔧 Requirements (Must Be True)

Before running the script:

- Ubuntu 20.04 / 22.04
- Root or sudo access
- MERN app already running
- Domain DNS **A record points to this server**

Verify DNS:

```bash
dig bulsujuans.xyz
```

Expected result: **your EC2 public IP**

---

## 📁 Step 1 — Create Script Directory

```bash
sudo mkdir -p /opt/scripts
sudo nano /opt/scripts/setup-nginx-ssl.sh
```

---

## 📜 Step 2 — Production Script

```bash
#!/bin/bash
set -euo pipefail

# =====================================================
# 🔐 PRODUCTION NGINX + SSL SETUP FOR MERN
# =====================================================

PROJECT_NAME="bulsujuans-mern-app"
DOMAIN="bulsujuans.xyz"
FRONTEND_PORT=3001
BACKEND_PORT=4001
EMAIL="jhondeldelconacaranay@gmail.com"

NGINX_AVAILABLE="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"

# =====================================================
# 🎨 Colors
# =====================================================
GREEN="\e[32m"
RED="\e[31m"
YELLOW="\e[33m"
BLUE="\e[34m"
RESET="\e[0m"

log() { echo -e "${BLUE}[INFO]${RESET} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${RESET} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${RESET} $1"; }
error() { echo -e "${RED}[ERROR]${RESET} $1"; exit 1; }

# =====================================================
# 1️⃣ Pre-checks
# =====================================================

if [[ $EUID -ne 0 ]]; then
   error "Please run as root (use sudo)."
fi

if ! grep -qi ubuntu /etc/os-release; then
    error "This script supports Ubuntu only."
fi

log "Checking required commands..."
for cmd in nginx curl dig; do
    if ! command -v $cmd &> /dev/null; then
        log "Installing missing package: $cmd"
        apt update -y
        apt install -y $cmd
    fi
done

# =====================================================
# 2️⃣ Verify Domain DNS
# =====================================================

log "Checking domain DNS resolution..."

SERVER_IP=$(curl -s ifconfig.me)
DNS_IP=$(dig +short $DOMAIN | tail -n1)

if [[ -z "$DNS_IP" ]]; then
    error "Domain does not resolve. Please configure DNS first."
fi

if [[ "$SERVER_IP" != "$DNS_IP" ]]; then
    error "Domain IP ($DNS_IP) does not match server IP ($SERVER_IP)"
fi

success "Domain correctly points to this server."

# =====================================================
# 3️⃣ Verify App Ports
# =====================================================

ss -tuln | grep ":$FRONTEND_PORT" > /dev/null || warn "Frontend not detected on port $FRONTEND_PORT"
ss -tuln | grep ":$BACKEND_PORT" > /dev/null || warn "Backend not detected on port $BACKEND_PORT"

# =====================================================
# 4️⃣ Install Nginx
# =====================================================

apt update -y
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# =====================================================
# 5️⃣ Firewall (Safe)
# =====================================================

if command -v ufw &> /dev/null; then
    ufw allow OpenSSH || true
    ufw allow 80 || true
    ufw allow 443 || true

    if ! ufw status | grep -q active; then
        ufw --force enable
    fi
fi

# =====================================================
# 6️⃣ Nginx Configuration
# =====================================================

cat > $NGINX_AVAILABLE <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location /api/ {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:$BACKEND_PORT/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf $NGINX_AVAILABLE $NGINX_ENABLED
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

# =====================================================
# 7️⃣ Certbot
# =====================================================

apt install -y certbot python3-certbot-nginx

certbot --nginx \
    -d $DOMAIN \
    --redirect \
    --agree-tos \
    --non-interactive \
    -m $EMAIL

# =====================================================
# 8️⃣ Auto-Renew Test
# =====================================================

certbot renew --dry-run

nginx -t
systemctl reload nginx

success "Setup complete!"
echo -e "🌐 https://$DOMAIN"
```

---

## ▶️ Step 3 — Make Executable

```bash
sudo chmod +x /opt/scripts/setup-nginx-ssl.sh
```

---

## ▶️ Step 4 — Run

```bash
sudo /opt/scripts/setup-nginx-ssl.sh
```

---

## ✅ Final Result

- ✔ Nginx installed
- ✔ Reverse proxy working
- ✔ HTTPS enforced
- ✔ SSL auto‑renew enabled
- ✔ Firewall configured safely
- ✔ Production‑ready MERN deployment

---

Happy deploying 😎
