# Dashboard Modülü

Bu doküman, ana gösterge paneli ve özet veri akışlarını içerir.

## Modül Özeti
- Özet veriler, grafikler, hızlı aksiyonlar
- API ile veri çekme ve görselleştirme

## Akış Diyagramı (Mermaid)
```mermaid
graph TD
  Kullanıcı -->|Dashboard| DashboardPage
  DashboardPage -->|API| Backend
  Backend -->|Veri| DashboardPage
  DashboardPage -->|Görselleştirme| ChartComponent
```

## Temel Componentler
- `DashboardPage`, `ChartComponent`, `StatsCard`

## Notlar
- Dashboard verileri API'den çekilmeli, loading ve error state'leri gösterilmeli.
