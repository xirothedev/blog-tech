# PHP Simple App - VPS Deployment Example

A simple PHP application to demonstrate how to deploy on VPS using Docker, Nginx, and MySQL.

## 🚀 Features

- PHP 8.2 with PHP-FPM
- Nginx as web server and reverse proxy
- MySQL 8.0 database
- Docker and Docker Compose for containerization
- Production-ready deployment

## 📋 Requirements

- Docker and Docker Compose installed
- Ports 80, 443, and 3306 available
- At least 2GB RAM

## 🛠️ Local Setup

### 1. Clone or copy project

```bash
cd examples/php-simple-app
```

### 2. Copy environment file

```bash
cp .env.example .env
```

### 3. Edit .env (optional)

```bash
nano .env
```

### 4. Build and start containers

```bash
docker-compose up --build -d
```

### 5. Test the application

Open your browser and visit: `http://localhost`

## 📁 Project Structure

```
php-simple-app/
├── src/
│   ├── config.php      # Configuration
│   └── db.php          # Database class
├── public/             # Static files (CSS, JS, images)
├── logs/               # Application logs
├── index.php           # Main entry point
├── Dockerfile          # PHP-FPM container
├── docker-compose.yml  # Multi-container setup
├── nginx.conf          # Nginx configuration
├── schema.sql          # Database schema
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

- `DB_HOST`: MySQL host (default: mysql)
- `DB_NAME`: Database name (default: myapp_db)
- `DB_USER`: Database user (default: myuser)
- `DB_PASSWORD`: Database password (default: mypassword)
- `APP_ENV`: Environment (production/development)
- `DEBUG`: Enable debug mode (true/false)

### Database

The database will be automatically created with the schema from `schema.sql` when the MySQL container starts for the first time.

## 📝 Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f php-fpm
docker-compose logs -f nginx
docker-compose logs -f mysql

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build -d

# Access PHP container
docker-compose exec php-fpm sh

# Access MySQL
docker-compose exec mysql mysql -u myuser -pmypassword myapp_db
```

## 🚢 Deploy to VPS

See detailed guide at: [Deploy PHP to VPS](/blog/vps/deploy-php-vps)

## 🔒 Security Notes

- Do not commit `.env` file to Git
- Change default passwords in production
- Enable firewall on VPS
- Use SSL/HTTPS for production
- Regularly update containers and dependencies

## 📚 References

- [PHP Documentation](https://www.php.net/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📄 License

MIT License
