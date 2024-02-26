packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  description = "The Google Cloud project ID"
}

variable "source_image_family" {
  description = "The family name of the source image used for building the instance"
}

variable "zone" {
  description = "The zone in which to build the instance"
}

variable "ssh_username" {
  description = "The username used for SSH authentication"
}

variable "machine_type" {
  description = "The machine type for the instance"
}

variable "image_name" {
  description = "The name of the resulting image"
}


source "googlecompute" "centos_stream8_image" {
  project_id_t          = "${var.project_id}"
  source_image_family = "${var.source_image_family}"
  zone                = "${var.zone}"
  ssh_username        = "${var.ssh_username}"
  machine_type        = "${var.machine_type}"
  image_name          = "${var.image_name}"
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
