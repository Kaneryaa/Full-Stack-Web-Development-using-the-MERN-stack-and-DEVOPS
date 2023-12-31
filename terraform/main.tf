provider "aws" {
    region = "us-east-1"  # Set your desired AWS region
}

resource "aws_instance" "example" {
    ami           = "ami-0c7217cdde317cfec"  # Specify an appropriate AMI ID
    instance_type = "t2.medium"
    subnet_id = "subnet-037547f5f0c405570"
    key_name = "k8s-keyPair"

}
resource "aws_instance" "node_js" {
    ami           = "ami-0c7217cdde317cfec"
    instance_type = "t2.medium"
    subnet_id     = "subnet-037547f5f0c405570"
    key_name      = "k8s-keyPair"
    security_groups = ["sg-07a6a419e96131832"]

    ebs_block_device {
        device_name = "/dev/sdf"
        volume_size = 20
        volume_type = "gp3"  # Specify the desired volume type (e.g., gp2, io1, etc.)
        # Other optional settings can be added here
    }
}
