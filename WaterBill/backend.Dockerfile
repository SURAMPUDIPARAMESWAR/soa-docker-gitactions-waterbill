
# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn/ .mvn/
COPY pom.xml .
COPY src/ src/

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Verify PostgreSQL driver is packaged in the executable JAR
RUN jar tf target/*.jar | grep 'BOOT-INF/lib/postgresql-' 

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 1427

ENTRYPOINT ["java", "-jar", "app.jar"]
