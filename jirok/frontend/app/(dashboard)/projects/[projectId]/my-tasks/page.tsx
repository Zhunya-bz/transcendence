interface MyTasksPageProps {
  params: {
    projectId: string;
  };
}

export default function MyTasksPage({ params }: MyTasksPageProps) {
  const { projectId } = params;

  return <></>;
}
