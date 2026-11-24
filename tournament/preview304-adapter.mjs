// Internal candidate bridge. Not imported by the normal tournament page.
import{previewController303}from'./preview303-controller.mjs';
export function previewAdapter304({rpc,token,room,member,round,epoch,onSnapshot=()=>{},...controllerOptions}){
const transport=async req=>{const full=req.phase==='read'?await rpc('hub_tournament_snapshot',{p_token:token}):await rpc('hub_preview304_phase',{p_token:token,p_round:round,p_epoch:req.epoch,p_phase:req.phase,p_value:req.value??null});
const v=full?.state?.preview303;if(full.code!==room||full.me!==member||full.state.number!==round+1||!v||v.epoch!==epoch)throw Error('Preview round changed');onSnapshot(full);return v};
const controller=previewController303({...controllerOptions,transport});controller.attach({room,member,epoch});return controller;
}
