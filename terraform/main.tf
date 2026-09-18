terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.65"
    }
  }

  backend "s3" {
    bucket       = "10alytics-devops-tfstate-282301322045"
    key          = "terraform.tfstate"
    region       = "eu-north-1"
    encrypt      = true
    use_lockfile = true
  }

  required_version = ">= 1.10.0"
}

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

module "network" {
  source = "./modules/network"

  project_name = var.project_name
}

module "compute" {
  source = "./modules/compute"

  project_name       = var.project_name
  instance_type      = var.instance_type
  ami_id             = data.aws_ami.ubuntu.id
  ssh_public_key     = var.ssh_public_key
  security_group_ids = [module.network.security_group_id]
}
