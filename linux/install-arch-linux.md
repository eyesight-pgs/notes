# install arch linux

Hint: practice this in virtual box before trying with bare metal
Hint: Arch wiki has everything you want to know

TLDR:
  - internet, sync time
  - partition, format, mount
  - pacstracp
  - fstab
  - chroot
  - timezone, hwclock
  - language
  - network
  - reboot


1. check internet - `ping 8.8.8.8`
1. `timedatectl set-ntp true`
1. disk partion (most dangerous step as you could loose your data)
  - use a tool like fdisk / cfdisk (also `lsblk` is your friend)
  - choose GTP
  - root partion - ext4, around 30 GB
  - boot partion - ext4, 512MB (mark as bootable; otherwise grub will cry)
  - swap partion - no file system, around 8GB, do swap on
1. format partions
  - root: ext4 | `mkfs.ext4 /dev/root_partion`
  - boot: fat32 | `mkfs.fat -F 32 /dev/boot_partition`
  - swap: no filesystem | `mkswap /dev/swap_partition`
1. mount
  - `mount /dev/root_partition /mnt`
  - `mount /dev/boot_partition /mnt/boot`
  - enable swap: `swapon /dev/swap_partition`
1. `pacstrap /mnt base linux linux-firmware vim` (longest step...depends on your internet speed)
1. `genfstab -U /mnt >> /mnt/etc/fstab`
1. `arch-chroot /mnt`
1. `ln -sf /usr/share/zoneinfo/Region/City /etc/localtime`
1. `hwclock --systohc`
1. language
  - run `vim /etc/locale.gen`
  - uncomment `en_US.UTF-8 UTF-8`
  - run `locale-gen`
  - run `echo "LANG=en_US.UTF-8" > /etc/locale.conf`
1. network
  - run `echo "my_host_name" > /etc/hostname`
  - install NetworkManager `pacman -S NetworkManager`
  - enable NetworkManager `systemctl enable NetworkManager`
  - check internet `ping 8.8.8.8`
1. run `mkinitcpio -P`
1. set root password, run `passwd`
1. create a normal user `useradd ...`
1. boot loader (most difficult one as it rarely works)
  - install grub
1. unmount using `umount -R /mnt`
1. reboot (congratulations!! installation completed*)
1. isntall and run neofetch



* if you are experienced enough / lucky enough



