# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the contents of the backend project into the container's /app directory
COPY backend/. .

# Run the build. Maven will now find pom.xml in /app
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Install netcat, a utility to check for open ports.
# We run as root to install, then switch back to a non-privileged user.
USER root
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
USER nobody

# Copy the built jar from the build stage
COPY --from=build /app/target/foodnow-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# This is the key change.
# The entrypoint now runs a shell command that first waits in a loop
# until it can successfully connect to the 'mysql' service on port 3306.
# Once the connection succeeds, it executes the java application.
ENTRYPOINT ["sh", "-c", "while ! nc -z mysql 3306; do sleep 1; done; java -jar app.jar"]
