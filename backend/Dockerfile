FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B -DskipTests dependency:go-offline
COPY src src
RUN mvn -B package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN mkdir -p /data && chown -R 1001:1001 /data /app
COPY --from=build /workspace/target/landing-admin-api-0.1.0.jar app.jar
USER 1001
ENV DINOPOS_DATA_PATH=/data/dinopos
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
