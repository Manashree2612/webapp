packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

source "googlecompute" "centos_stream8_image" {
  project_id          = "cloud-project-413915"
  source_image_family = "centos-stream-8"
  zone                = "us-east1-b"
  ssh_username        = "packer"
  machine_type        = "e2-standard-16"
  image_name          ="centos-image"
}

build {
  sources = ["sources.googlecompute.centos_stream8_image"]

  provisioner "file" {
    source      = "../webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "./setup.sh"
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
  }
}
