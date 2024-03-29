# Mes --- Maxwell Equations of Software
# Copyright © 2020 Jeremiah Orians
#
# This file is part of Mes.
#
# Mes is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or (at
# your option) any later version.
#
# Mes is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Mes.  If not, see <http://www.gnu.org/licenses/>.

VPATH = bin

# Directories
bin:
	mkdir -p bin

# make the NASM pieces
hex0-nasm: NASM/hex0_x86.S | bin
	nasm -felf32 NASM/hex0_x86.S -o bin/hex0.o
	ld -melf_i386 bin/hex0.o -o bin/hex0-nasm

hex1-nasm: NASM/hex1_x86.S | bin
	nasm -felf32 NASM/hex1_x86.S -o bin/hex1.o
	ld -melf_i386 bin/hex1.o -o bin/hex1-nasm

catm-nasm: NASM/catm_x86.S | bin
	nasm -felf32 NASM/catm_x86.S -o bin/catm.o
	ld -melf_i386 bin/catm.o -o bin/catm-nasm

hex2-nasm: NASM/hex2_x86.S | bin
	nasm -felf32 NASM/hex2_x86.S -o bin/hex2.o
	ld -melf_i386 bin/hex2.o -o bin/hex2-nasm

M0-nasm: NASM/M0_x86.S | bin
	nasm -felf32 NASM/M0_x86.S -o bin/M0.o
	ld -melf_i386 bin/M0.o -o bin/M0-nasm

cc_x86-nasm: NASM/cc_x86.S | bin
	nasm -felf32 NASM/cc_x86.S -o bin/cc_x86.o
	ld -melf_i386 bin/cc_x86.o -o bin/cc_x86-nasm

kaem-nasm: NASM/kaem-minimal.S | bin
	nasm -felf32 NASM/kaem-minimal.S -o bin/kaem.o
	ld -melf_i386 bin/kaem.o -o bin/kaem-nasm
