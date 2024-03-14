# This project refer to TMC test
Nestjs template that have feature<br>
<ul>
    <li>Database use PostgreSQL with TypeORM</li>
    <li>Database divide for Command Database and Query Database</li>
    <li>Command Database (for handle execute command query like insert, delete, update) and Query Database (for find/search data)</li>
    <li>Sync between 2 Database use Kafka Producer and Consumer </li>
    <li>Have migration feature</li>
    <li>Have unit testing example</li>
    <li>Have validation DTO</li>
    <li>Have simple API Authorization middleware</li>
</ul>

# Quick Setup
<ul>
    <li>Installation => `npm install`</li>
    <li>Migration Up database => `npm run typeorm:run-migrations`</li>
    <li>Migration Down database => `npm run typeorm:revert-migrations`</li>
    <li>Run development API with debug hot reload => `npm run start:dev`</li>
</ul>

# API List
<ul>
    <li>POST http://localhost:3000/api/categories<br><pre>
        curl --location 'http://localhost:3000/api/categories' \
        --header 'Authorization: b1b65baf-9a95-4f45-b972-1bed0b29bfd3' \
        --header 'Content-Type: application/json' \
        --data '{
            "name": "ddddd"
        }'
    </pre></li>
    <li>POST http://localhost:3000/api/products<br><pre>
        curl --location 'http://localhost:3000/api/products' \
        --header 'Authorization: b1b65baf-9a95-4f45-b972-1bed0b29bfd3' \
        --header 'Content-Type: application/json' \
        --data '{
            "sku": "p3",
            "name": "Product Name 3",
            "price": 20000,
            "stock": 10,
            "categoryId": "9ccc6765-8073-4f0f-9bff-458c7c2ec739"
        }'
    </pre></li>
    <li>GET http://localhost:3000/api/search<br><pre>
        curl --location 'http://localhost:3000/api/search?sku=p1&sku=2&name=ani&name=awan&price.start=1000&price.end=100000&stock.start=1&stock.end=100&category.id=1f218e3e-c51e-4e69-a1d0-75167e5667e8&category.id=e6b1c151-2b4b-4851-85d2-cb249c3c6aac&category.name=makanan&category.name=minuman&page=3&perPage=1' \
        --header 'Authorization: b1b65baf-9a95-4f45-b972-1bed0b29bfd3'
    </pre></li>
</ul>