FROM python:3.14.7-slim AS builder

WORKDIR /build

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN python -m venv /opt/venv
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

FROM python:3.14.7-slim AS runtime

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]
