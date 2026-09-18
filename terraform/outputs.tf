output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = module.compute.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = module.compute.public_dns
}

output "ssh_command" {
  description = "Command to SSH into the EC2 instance"
  value       = "ssh -i ~/.ssh/${module.compute.key_name}.pem ubuntu@${module.compute.public_ip}"
}
