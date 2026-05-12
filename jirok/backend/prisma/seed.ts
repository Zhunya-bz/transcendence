import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://jirok:jirok_secret@localhost:5432/jirok_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('----- Seeding Database -----');

    console.log('----- creating users -----');
    const user1 = await prisma.user.upsert({
        where: { email: 'user@student.42.fr' },
        update: {},
        create: {
            name: 'PAUL',
            surname: 'SMITH',
            email: 'user@student.42.fr',
            passwordHash: 'dummy_hash',
            jobTitle: 'Developer',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@student.42.fr' },
        update: {},
        create: {
            name: 'John',
            surname: 'Doe',
            email: 'user2@student.42.fr',
            passwordHash: 'dummy_hash',
            jobTitle: 'Project manager',
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: 'user3@student.42.fr' },
        update: {},
        create: {
            name: 'Bob',
            surname: 'The Builder',
            email: 'user3@student.42.fr',
            passwordHash: 'dummy_hash',
            jobTitle: 'Builder',
        },
    });

    const user4 = await prisma.user.upsert({
        where: { email: 'user4@student.42.fr' },
        update: {},
        create: {
            name: 'Adam',
            surname: 'Sandler',
            email: 'user4@student.42.fr',
            passwordHash: 'dummy_hash',
            jobTitle: 'CEO',
        },
    });

    const user5 = await prisma.user.upsert({
        where: { email: 'user5@student.42.fr' },
        update: {},
        create: {
            name: 'Charlie',
            surname: 'Chaplin',
            email: 'user5@student.42.fr',
            passwordHash: 'dummy_hash',
            jobTitle: 'Entertainment',
        },
    });

    console.log('----- Creating projects -----');
    const project1 = await prisma.project.upsert({
        where: { projectKey: 'JRK' },
        update: {},
        create: {
            name: 'Jirok Jira Clone',
            projectKey: 'JRK',
            members: {
                create: [
                    { userId: user1.id, role: 'Admin' },
                    { userId: user2.id, role: 'Member' },
                    { userId: user5.id, role: 'Member' },
                ]
            }
        }
    });

    const project2 = await prisma.project.upsert({
        where: { projectKey: 'FTT' },
        update: {},
        create: {
            name: 'ft_transcendence',
            projectKey: 'FTT',
            members: {
                create: [
                    { userId: user3.id, role: 'Admin' },
                    { userId: user1.id, role: 'Member' },
                    { userId: user4.id, role: 'Member' },
                ]
            }
        }
    });

    console.log('----- Creating Issues -----');
    await prisma.issue.createMany({
        data: [
            {
                title: 'Set up Next.js frontend',
                description: ' Initialize the frontend with Next.js and Tailwind',
                status: 'IN_PROGRESS',
                type: 'TASK',
                priority: 'HIGH',
                projectId: project1.id,
                reporterId: user2.id,
                assigneeId: user1.id,
            },
            {
                title: 'Dockerize the backend',
                description: 'Make Dockerfiles and docker-compose.yml',
                status: 'IN_REVIEW',
                type: 'TASK',
                priority: 'HIGH',
                projectId: project1.id,
                reporterId: user2.id,
                assigneeId: user5.id,
            },
            {
                title: 'Database connection failing',
                description: 'Error on startup of Prisma',
                status: 'TODO',
                type: 'BUG',
                priority: 'MEDIUM',
                projectId: project2.id,
                reporterId: user1.id,
                assigneeId: user4.id,
            }
        ],
        skipDuplicates: true,
    });

    console.log('----- SEEDING FINISHED, GREAT SUCCESS! -----');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });