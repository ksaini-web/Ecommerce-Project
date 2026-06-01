FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:resolve

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/ecommerce-backend-*.jar app.jar

ENV PORT=8080 \
    DB_URL=jdbc:mysql://localhost:3306/ecommerce \
    DB_USER=root \
    DB_PASSWORD=root

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
