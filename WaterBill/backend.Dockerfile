# Stage 1: Build the app
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY mvnw .          
COPY .mvn/ .mvn
COPY pom.xml ./
COPY src ./src

RUN chmod +x mvnw


RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 🔴 *.jar ki jagah exact final executable jar ka naam dein
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 1427
ENTRYPOINT ["java", "-jar", "app.jar"]
