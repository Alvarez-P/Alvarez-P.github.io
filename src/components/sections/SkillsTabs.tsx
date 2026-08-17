import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from '@/components/animations/tabs';
import { Badge } from '@/components/ui/badge';
import { skillCategories, type Skill } from '@/data/skills';

function SkillBadge({ skill }: { skill: Skill }) {
  if (skill.learning) {
    return (
      <Badge
        variant="outline"
        className="text-[color:var(--redshift)]/90 [&_svg]:text-[color:var(--redshift)]/60"
      >
        {skill.name}
        <span className="text-[color:var(--redshift)]/55">· aprendizaje</span>
      </Badge>
    );
  }

  return <Badge variant="outline">{skill.name}</Badge>;
}

function SkillsTabs() {
  const first = skillCategories[0];

  return (
    <Tabs defaultValue={first.id}>
      <TabsList>
        {skillCategories.map((category) => (
          <TabsTrigger key={category.id} value={category.id} className="hover:text-foreground duration-200">
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContents>
        {skillCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="flex flex-wrap gap-2 px-1 pb-2 pt-5">
              {category.skills.map((skill) => (
                <SkillBadge key={skill.name} skill={skill} />
              ))}
            </div>
          </TabsContent>
        ))}
      </TabsContents>
    </Tabs>
  );
}

export default SkillsTabs;
