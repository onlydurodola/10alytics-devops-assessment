resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-deployer"
  public_key = var.ssh_public_key
}

resource "aws_instance" "web" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = var.security_group_ids

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y python3-pip
  EOF

  tags = {
    Name = "${var.project_name}-web"
  }
}
