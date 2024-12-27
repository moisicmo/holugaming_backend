import { Game_type, Phase_type, PrismaClient } from '@prisma/client';
// import { envs } from '../src/config/envs';
// import { bcryptAdapter } from '../src/config/bcrypt.adapter';

async function main() {
  const prisma = new PrismaClient();

  try {

    // //  CREA UNA FUNCIÓN; a partir de una Subscription crea Payment, PaymentState e Invoice
    // await prisma.$executeRawUnsafe(`
    //     CREATE OR REPLACE FUNCTION create_payment_on_subscription()
    //     RETURNS TRIGGER AS $$
    //     DECLARE
    //         plan_billing_cycle INTEGER;
    //         payment_id INTEGER;
    //     BEGIN
    //         -- Obtener el billingCycle del plan correspondiente
    //         SELECT "billingCycle" INTO plan_billing_cycle
    //         FROM "Plans"
    //         WHERE id = NEW."planId";

    //         -- Crear un pago
    //         INSERT INTO "Payments" ("subscriptionId", "referenceCode", "description", "start", "end", "amount", "updatedAt")
    //         VALUES (
    //             NEW.id,
    //             CONCAT('SUB', NEW.id),
    //             'Suscripción automática',
    //             CURRENT_DATE,
    //             CURRENT_DATE + plan_billing_cycle,
    //             0,
    //             CURRENT_TIMESTAMP
    //         )
    //         RETURNING id INTO payment_id;

    //         -- Crear estados de pago
    //         INSERT INTO "PaymentStates" ("paymentId","TypePaymentState","updatedAt")
    //         VALUES
    //             ( payment_id, 'PENDIENTE', CURRENT_TIMESTAMP ),
    //             ( payment_id, 'FINALIZADO', CURRENT_TIMESTAMP );

    //         -- Crear una factura
    //         INSERT INTO "Invoices" ("paymentId","nameInvoice","numberDocument","updatedAt")
    //         VALUES
    //             ( payment_id, 'apellido', '123456', CURRENT_TIMESTAMP );

    //         RETURN NEW;
    //     END;
    //     $$ LANGUAGE plpgsql;
    //   `);

    // // ASIGNA UN TRIGGER A LA TABLA Subscriptions,
    // // DONDE LLAMA LA FUNCIÓN create_payment_on_subscription
    // // DESPUES DE CREAR UN Subscription
    // await prisma.$executeRawUnsafe(`
    //     CREATE TRIGGER trigger_create_payment_on_subscription
    //     AFTER INSERT ON "Subscriptions"
    //     FOR EACH ROW
    //     EXECUTE FUNCTION create_payment_on_subscription();
    //   `);

    // //  CREA UNA FUNCIÓN; a partir de un estado FINALIZADO actualiza el state de la Subscription a true
    // await prisma.$executeRawUnsafe(`
    //     CREATE OR REPLACE FUNCTION update_subscription_on_payment_state()
    //     RETURNS TRIGGER AS $$
    //     DECLARE
    //         subscription_id INTEGER;
    //     BEGIN
    //         -- Verificar si el estado de pago es FINALIZADO
    //         IF NEW."TypePaymentState" = 'FINALIZADO' THEN
    //             -- Obtener el id de la suscripción asociada al pago
    //             SELECT "subscriptionId" INTO subscription_id
    //             FROM "Payments"
    //             WHERE id = NEW."paymentId";

    //             -- Actualizar el estado de la suscripción a true
    //             UPDATE "Subscriptions"
    //             SET "state" = true
    //             WHERE id = subscription_id;
    //         END IF;

    //         RETURN NEW;
    //     END;
    //     $$ LANGUAGE plpgsql;
    //   `);

    // await prisma.$executeRawUnsafe(`
    //     CREATE TRIGGER trigger_update_subscription_on_payment_state
    //     AFTER INSERT ON "PaymentStates"
    //     FOR EACH ROW
    //     EXECUTE FUNCTION update_subscription_on_payment_state();
    //   `);


    // CREAR JUEGOS
    const games = await prisma.games.createManyAndReturn({
      data: [
        {
          name: 'Dota 1 RGC',
          type: Game_type.MOVA,
          state: true,
        },
        {
          name: 'Dota 1 ATINAD',
          type: Game_type.MOVA,
          state: true,
        },
        {
          name: 'Dota 2',
          type: Game_type.MOVA,
          state: true,
        }
      ]
    });
    // CREAR TORNEO
    const tournament = await prisma.tournaments.create({
      data: {
        gameId: games[0].id,
        name: 'Torneo HoluGaming Dota 1',
        numberTeams: 16,
        start: new Date(),
        end: new Date(),
        inscriptionCost: 25.0,
        playerCount: 5,
        substituteCount: 2,
      }
    });
    // CREAR FASES
    const phases = await prisma.phases.createManyAndReturn({
      data: [
        {
          tournamentId: tournament.id,
          name: 'Bo1',
          phaseType: Phase_type.kNOcKOUT,
          matchDefinition: 1,
          teamsInput: 16,
          teamsOutput: 4,
          start: new Date(),
          end: new Date(),
        },
        {
          tournamentId: tournament.id,
          name: 'Liguilla',
          phaseType: Phase_type.ROUND_ROBIN,
          matchDefinition: 1,
          teamsInput: 4,
          teamsOutput: 2,
          start: new Date(),
          end: new Date(),
        },
        {
          tournamentId: tournament.id,
          name: 'Bo3',
          phaseType: Phase_type.kNOcKOUT,
          matchDefinition: 3,
          teamsInput: 2,
          teamsOutput: 1,
          start: new Date(),
          end: new Date(),
        }
      ]
    })
    // GENERAR MATCHES DINÁMICAMENTE
    phases.forEach(async (phase) => {
      let totalMatches: number = 0;
    
      switch (phase.phaseType) {
        case Phase_type.ROUND_ROBIN:
          totalMatches = ((phase.teamsInput * (phase.teamsInput - 1)) / 2) * phase.matchDefinition;
          break;
    
        case Phase_type.kNOcKOUT:
          let currentTeams = phase.teamsInput;
          while (currentTeams > phase.teamsOutput) {
            totalMatches += (currentTeams / 2) * phase.matchDefinition;
            currentTeams = currentTeams / 2;
          }
          break;
      }
    
      console.log(`Total de partidos para la fase ${phase.name}:`, totalMatches);
    
      // Crear los partidos dinámicamente
      for (let i = 0; i < totalMatches; i++) {
        await prisma.matches.create({
          data: {
            phaseId: phase.id,
            description: `Match ${i + 1} of Phase ${phase.name}`,
            schedule: new Date(),
          },
        });
      }
    });
    

    // // CREAR USUARIO
    // const user = await prisma.users.create({
    //   data: {
    //     numberDocument: envs.DNI,
    //     typeDocument: 'DNI',
    //     name: envs.NAME_SEED,
    //     lastName: envs.LAST_NAME_SEED,
    //     password: bcryptAdapter.hash(envs.EMAIL_SEED),
    //   },
    // });
    // // CREAR NEGOCIO
    // const business = await prisma.businesses.create({
    //   data: {
    //     typeBusiness: 'ADMINISTRACION',
    //     name: 'HOLU',
    //     url: 'www.holu.com',
    //     branches: {
    //       create: {
    //         name: 'HOLU',
    //         users:{
    //           connect: [{ id: user.id }]
    //         }
    //       },
    //     }
    //   },
    //   include: {
    //     branches: true
    //   }
    // });

    // // CREAR SUSCRIPCIÓN
    // await prisma.subscriptions.create({
    //   data: {
    //     businessId: business.id,
    //     planId: plans[0].id,
    //   }
    // });

    // // CREAR ROLES Y PERMISOS
    // const role = await prisma.roles.create({
    //   data: {
    //     businessId: business.id,
    //     name: 'administrador',
    //     permissions: {
    //       create: [
    //         {
    //           businessId: business.id,
    //           name: 'crear',
    //           module: 'crear',
    //         },
    //         {
    //           businessId: business.id,
    //           name: 'editar',
    //           module: 'editar',
    //         },
    //       ],
    //     },
    //   },
    // });



    // // CREAR CONTACTO
    // await prisma.contacts.create({
    //   data: {
    //     userId: user.id,
    //     data: envs.EMAIL_SEED,
    //     validated: true,
    //   },
    // });

    // // CREAR STAFF
    // await prisma.staffs.create({
    //   data: {
    //     userId: user.id,
    //     roleId: role.id,
    //     superStaff: true,
    //   },
    // });

    console.log('Datos de semilla insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de semilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
