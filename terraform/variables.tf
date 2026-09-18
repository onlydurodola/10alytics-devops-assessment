variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for all named resources"
  type        = string
  default     = "10alytics-assessment"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}
