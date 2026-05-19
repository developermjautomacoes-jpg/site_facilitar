'use client'
import { motion } from 'framer-motion'
import { ServiceCard } from '@/components/ui/ServiceCard'

const DEPARTMENTS = [
  {
    id: 'societario',
    title: 'Departamento Societário',
    description: 'Abertura, alteração e encerramento de empresas, registros e alvarás com agilidade e segurança jurídica.',
    icon: 'Building2',
  },
  {
    id: 'contabil',
    title: 'Departamento Contábil',
    description: 'Escrituração contábil, demonstrações financeiras e relatórios gerenciais para apoiar decisões estratégicas.',
    icon: 'BookOpen',
  },
  {
    id: 'fiscal',
    title: 'Departamento Fiscal',
    description: 'Apuração de impostos, entrega de obrigações acessórias e conformidade com as exigências do Fisco.',
    icon: 'FileText',
  },
  {
    id: 'pessoal',
    title: 'Departamento Pessoal',
    description: 'Folha de pagamento, admissões, demissões, eSocial e gestão completa de colaboradores.',
    icon: 'Users',
  },
]

const INCENTIVES = [
  {
    id: 'compete',
    title: 'Compete',
    description: 'Assessoria completa no programa de incentivo fiscal Compete para empresas do Espírito Santo.',
    icon: 'TrendingDown',
  },
  {
    id: 'contribuinte-substituto',
    title: 'Contribuinte Substituto',
    description: 'Gestão e regularização do regime de substituição tributária com eficiência e segurança.',
    icon: 'Scale',
  },
  {
    id: 'invest-es',
    title: 'Invest-ES',
    description: 'Orientação e habilitação para o programa de incentivo ao investimento do Espírito Santo.',
    icon: 'BarChart3',
  },
  {
    id: 'fundap',
    title: 'Fundap',
    description: 'Suporte no acesso ao Fundo para o Desenvolvimento das Atividades Portuárias e benefícios fiscais.',
    icon: 'ShieldCheck',
  },
]

function GroupLabel({ label, color }: { label: string; color: 'blue' | 'emerald' }) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mb-5 ${styles[color]}`}>
      {label}
    </span>
  )
}

export function ServicesSection() {
  return (
    <section id="especialidades" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Nossas Especialidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Departamentos & <span className="text-gradient">Incentivos Fiscais</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estrutura completa de departamentos e domínio nos principais incentivos fiscais do Espírito Santo.
          </p>
        </motion.div>

        {/* Group 1: Departamentos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <GroupLabel label="Departamentos" color="blue" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {DEPARTMENTS.map((item, i) => (
              <ServiceCard key={item.id} {...item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-10" />

        {/* Group 2: Incentivos Fiscais */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GroupLabel label="Incentivos Fiscais" color="emerald" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {INCENTIVES.map((item, i) => (
              <ServiceCard key={item.id} {...item} index={i} accent="emerald" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
