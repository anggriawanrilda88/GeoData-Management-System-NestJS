# This GeoData Management System (NestJS) project presented for assessment test Bvarta
GeoData Management System (NestJS) with function<br>
<ul>
    <li>Database use PostgreSQL with TypeORM</li>
    <li>Have seeding and migration feature</li>
    <li>Have unit testing example</li>
    <li>Have validation DTO</li>
    <li>Have JWT API Authentication middleware</li>
    <li>Have Roles API Authorization middleware</li>
    <li>Implement data reader endpoint 'POST http://localhost:3000/api/geo-locations' to add geo location data to database from file geojson upload.</li>
</ul>

# Quick Setup
<ul>
    <li>Ensure you has create .env on this project. copy paste .env.example and fill all configuration parameter right.</li>
    <li>Installation => <pre>npm install</pre></li>
    <li>Migration Up database => <pre>npm run typeorm:up-migrations</pre></li>
    <li>Migration Down database => <pre>npm run typeorm:down-migrations</pre></li>
    <li>Run development API with debug hot reload => <pre>npm run start:dev</pre></li>
    <li>Access on <pre>http://localhost:3000</pre></li>
    <li>To See API Documentation access on <pre>http://localhost:3000/api</pre></li>
</ul>

# Authorization
This API has 2 roles "user" and "admin" and simple implementation roles provide to secure access, there are the list of roles path with alias. For detail you can see the code.
<pre>
const Roles = {
            "user": ['user.detail', 'geo-locations.list'],
            "admin": ['user.list', 'user.detail', 'geo-locations.create', 'geo-locations.list']
        }
</pre>