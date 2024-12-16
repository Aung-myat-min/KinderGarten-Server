-- AlterTable
ALTER TABLE `Child` MODIFY `profileURL` VARCHAR(191) NOT NULL DEFAULT 'https://i.pravatar.cc/150';

-- AlterTable
ALTER TABLE `Parent` MODIFY `NRC` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `profileURL` VARCHAR(191) NOT NULL DEFAULT 'https://i.pravatar.cc/150';
