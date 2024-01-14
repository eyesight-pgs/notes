# hibernate

First this we need to have is is either a swap partition or a swapfile.
Bellow in instructions uses swap partition. If you want to use swapfile
then RTFM.

```bash
# identify your swap drive/partition
lsblk

# create swap partition
fdisk /dev/sdx

# format
mkswap /dev/sdxy

# swapon
swapon /dev/sdxy

# find uuid of the swap drive
lsblk -o uuid,name

# add fstab entry (/etc/fstab)
# ex:
#   UUID=cf2d5a22-fd1c-43bb-89f5-c46858753b5f none swap defaults 0 0

# add `resume` (after `udev`) HOOK to mkinit (/etc/mkinitcpio.conf)
# ex:
#   HOOKS=(base udev resume autodetect modconf kms keyboard keymap consolefont block filesystems fsck)
# now regenerate initial ramdisk (-P means all presets)
sudo mkinitcpio -P

# add resume uuid to grub (/etc/default/grub)
# ex:
#   GRUB_CMDLINE_LINUX="<existing_values> resume=UUID=cf2d5a22-fd1c-43bb-89f5-c46858753b5e"
# note: in above line <existing_values> is a placeholder

# regenerate grub config
# note: bellow command ASSUMES your grub.cfg file location is /boot/grub/grub.cfg
grub-mkconfig -o /boot/grub/grub.cfg

# all done.... do a reboot
reboot

# NOW YOU CAN HAPPILY HIBERNATE YOUR SYSTEM WITH FOLLOWING COMNMAND
systemctl hibernate
```

References:
- mkinitcpio (https://wiki.archlinux.org/title/Mkinitcpio)
- grub regenerate config (https://wiki.archlinux.org/title/Kernel_parameters#:~:text=And%20then%20automatically-,re%2Dgenerate,-the)
- hibernate (https://wiki.archlinux.org/title/Power_management/Suspend_and_hibernate#:~:text=Sleep%5D%0ASuspendState%3Dfreeze-,Hibernation,-In%20order%20to)




