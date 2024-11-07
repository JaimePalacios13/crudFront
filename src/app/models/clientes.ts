import { actividadEconomica } from "./actividadEconomica";
import { estadoCivil } from "./estadoCivil";

export class clientes {
    id: number = 0;
    dui!: string;
    nit!: string;
    nombres!: string;
    apellidos!: string;
    sexo!: string;
    actividadEconomica: actividadEconomica = new actividadEconomica();
    estadoCivil: estadoCivil = new estadoCivil();
}
