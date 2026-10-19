
# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY mvnw .
COPY .mvn/ .mvn/
COPY pom.xml .
COPY src/ src/

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/WaterBill-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 1427

ENTRYPOINT ["java", "-jar", "app.jar"]
