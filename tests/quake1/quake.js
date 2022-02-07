print("Run the quake1 engine");
print("you need the engine source in ../quake1_src and id1 pak files in ../quake1_data/id1 (relative to the root of mishmashvm)");

quake1_src="../quake1_src";
quake1_data="../quake1_data";

print("unfinished might not work yet");


quake_objs=["cd_null.c","chase.c","cl_demo.c","cl_input.c","cl_main.c","cl_parse.c","cl_tent.c","cmd.c","common.c","console.c","crc.c","cvar.c","d_edge.c","d_fill.c","d_init.c","d_modech.c","d_part.c","d_polyse.c","d_scan.c","d_sky.c","d_sprite.c","d_surf.c","d_vars.c","d_zpoint.c","draw.c","host.c","host_cmd.c","in_null.c","keys.c","mathlib.c","menu.c","model.c","net_dgrm.c","net_loop.c","net_main.c","net_none.c","net_vcr.c","nonintel.c","pr_cmds.c","pr_edict.c","pr_exec.c","r_aclip.c","r_alias.c","r_bsp.c","r_draw.c","r_edge.c","r_efrag.c","r_light.c","r_main.c","r_misc.c","r_part.c","r_sky.c","r_sprite.c","r_surf.c","r_vars.c","sbar.c","screen.c","snd_dma.c","snd_mem.c","snd_mix.c","sv_main.c","sv_move.c","sv_phys.c","sv_user.c","sys_null.c","vid_null.c","view.c","wad.c","world.c","zone.c"];

quake_objs=quake_objs.map(function(x){
  print(x);
  return mm.load_c_string(read(quake1_src+"/"+x),{extra_flags:"-I "+quake1_src+" -DNO_ASM -DNATIVE"});
});
