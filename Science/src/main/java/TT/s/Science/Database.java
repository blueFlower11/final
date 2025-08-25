package TT.s.Science;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class Database {
    private final String url = "jdbc:postgresql://localhost:5432/dennis";
    private final String user = "postgres";
    private final String password = "postgres";
    private Game game;

    private class DBcont{
        public int id;
        public int step;
        public String board;

        public DBcont(){}
    }

    public Database(){
        this.game = new Game();
        add();
        restartDennis();
    }

    public Connection connect(){
        Connection conn = null;
        try{
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Uspjesno spajanje");
        }catch (SQLException | ClassNotFoundException e){
            System.out.println(e);
        }
        return conn;
    }

    public void add(){
        try{
            Statement stmnt = null;
            File file = new File("dennisDB.txt");
            FileWriter DBdennis = new FileWriter("dennisDB.txt");
            stmnt = connect().createStatement();
            for(Integer i : game.eqBoards.keySet()){
                int step = game.eqBoards.get(i).brElem();
                StringBuilder board = new StringBuilder("|");
                for(int x = 0; x < 3; x++){
                    for(int y = 0; y < 3; y++){
                        if(game.eqBoards.get(i).get(0)[x][y] == fieldState.CROS) board.append("X");
                        else if(game.eqBoards.get(i).get(0)[x][y] == fieldState.CIRCLE) board.append("O");
                        else board.append(" ");
                    }
                }
                board.append("|");
                if(step != 8){
                    StringBuilder sql = new StringBuilder("INSERT INTO BOARDS(STEP, BOARD, P00, P01, P02, P10, P11, P12, P20, P21, P22)" + " VALUES " + "(" + step + ", '" + board + "', ");
                    if(step == 0) sql.append(9 + ", " + 9 + ", " + 9 + ", " + 9 + "," + 9 + ", " + 9 + ", " + 9 + ", " + 9 + "," + 9 + ");");
                    else if(step == 1) {
                        if(board.charAt(1) == ' ') sql.append(8);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 8);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 2) {
                        if(board.charAt(1) == ' ') sql.append(6);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 3) {
                        if(board.charAt(1) == ' ') sql.append(6);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 6);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 4) {
                        if(board.charAt(1) == ' ') sql.append(3);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 5) {
                        if(board.charAt(1) == ' ') sql.append(3);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 3);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 6) {
                        if(board.charAt(1) == ' ') sql.append(1);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    else if(step == 7) {
                        if(board.charAt(1) == ' ') sql.append(1);
                        else sql.append(0);
                        if(board.charAt(2) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(3) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(4) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(5) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(6) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(7) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(8) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        if(board.charAt(9) == ' ') sql.append("," + 1);
                        else sql.append("," + 0);
                        sql.append(");");
                    }
                    DBdennis.write(sql.toString() + "\n");
                    stmnt.executeUpdate(sql.toString());
                } else{
                    StringBuilder sql = new StringBuilder("INSERT INTO BOARDS(STEP, BOARD, P00, P01, P02, P10, P11, P12, P20, P21, P22)" + " VALUES " + "(" + step + ", '" + board + "', ");
                    if(board.charAt(1) == ' ') sql.append(1);
                    else sql.append(0);
                    if(board.charAt(2) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(3) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(4) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(5) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(6) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(7) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(8) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    if(board.charAt(9) == ' ') sql.append("," + 1);
                    else sql.append("," + 0);
                    sql.append(");");
                    DBdennis.write(sql.toString() + "\n");
                    stmnt.executeUpdate(sql.toString());
                    System.out.println(sql.toString());
                }
            }
            File fileG = new File("gamesDB.txt");
            FileWriter DBgames = new FileWriter("gamesDB.txt");
            for(Integer i : game.children.keySet()){
                StringBuilder chld = new StringBuilder();
                chld.append("'{");
                for(int c : game.children.get(i)){
                    chld.append(c);
                    if(c != game.children.get(i).stream().toList().get(game.children.get(i).size() - 1)) chld.append(", ");
                }
                chld.append("}'");
                String sql = "INSERT INTO GAMES(IDBOARD, WIN, LOSE, CHILDRENID) VALUES(" + i +", " + 0 + ", " + 0 +", " + chld + ");";
                DBgames.write(sql.toString() + "\n");
                stmnt.executeUpdate(sql.toString());
            }
        }catch (SQLException | IOException e){
            System.out.println(e.getMessage());
        }
    }

    public void restartDennis(){
        try {
            Statement stmnt = null;
            stmnt = connect().createStatement();
            File file = new File("dennisDBupdate.txt");
            FileWriter DBdennis = new FileWriter("dennisDBupdate.txt");
            String sqlS = "SELECT ID, STEP, BOARD FROM BOARDS";
            ArrayList<DBcont> dbitems = new ArrayList<>();
            var rs = stmnt.executeQuery(sqlS);
            while(rs.next()){
                DBcont item = new DBcont();
                item.id = rs.getInt("ID");
                item.step = rs.getInt("STEP");
                item.board = rs.getString("BOARD");
                dbitems.addLast(item);
            }
            for(DBcont dbi : dbitems){
                StringBuilder sql = new StringBuilder("UPDATE BOARDS SET ");
                if(dbi.step == 0) sql.append("P00=" + 9 + ", P01=" + 9 + ", P02=" + 9 + ", P10=" + 9 + ", P11=" + 9 + ", P12=" + 9 + ", P20=" + 9 + ", P21=" + 9 + ", P22=" + 9);
                else if(dbi.step == 1){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 8);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 8);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 8);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 8);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 8);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 8);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 8);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 8);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 8);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 2){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 6);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 6);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 6);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 6);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 6);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 6);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 6);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 6);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 6);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 3){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 6);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 6);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 6);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 6);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 6);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 6);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 6);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 6);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 6);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 4){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 6);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 6);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 6);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 6);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 6);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 6);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 6);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 6);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 6);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 5){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 3);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 3);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 3);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 3);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 3);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 3);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 3);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 3);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 3);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 6){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 1);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 1);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 1);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 1);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 1);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 1);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 1);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 1);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 1);
                    else sql.append(",P22=" + 0);
                }
                else if(dbi.step == 7){
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 1);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 1);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 1);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 1);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 1);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 1);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 1);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 1);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 1);
                    else sql.append(",P22=" + 0);
                }else{
                    if(dbi.board.charAt(1) == ' ') sql.append("P00=" + 1);
                    else sql.append("P00=" + 0);
                    if(dbi.board.charAt(2) == ' ') sql.append(",P01=" + 1);
                    else sql.append(",P01=" + 0);
                    if(dbi.board.charAt(3) == ' ') sql.append(",P02=" + 1);
                    else sql.append(",P02=" + 0);
                    if(dbi.board.charAt(4) == ' ') sql.append(",P10=" + 1);
                    else sql.append(",P10=" + 0);
                    if(dbi.board.charAt(5) == ' ') sql.append(",P11=" + 1);
                    else sql.append(",P11=" + 0);
                    if(dbi.board.charAt(6) == ' ') sql.append(",P12=" + 1);
                    else sql.append(",P12=" + 0);
                    if(dbi.board.charAt(7) == ' ') sql.append(",P20=" + 1);
                    else sql.append(",P20=" + 0);
                    if(dbi.board.charAt(8) == ' ') sql.append(",P21=" + 1);
                    else sql.append(",P21=" + 0);
                    if(dbi.board.charAt(9) == ' ') sql.append(",P22=" + 1);
                    else sql.append(",P22=" + 0);
                }
                sql.append(" WHERE ID=" + dbi.id + ";");
                DBdennis.write(sql.toString() + "\n");
                stmnt.executeUpdate(sql.toString());
            }
            File fileG = new File("gamesDBupdate.txt");
            FileWriter DBgames = new FileWriter("gamesDBupdate.txt");
            for(Integer i : game.children.keySet()){
                String sql = "UPDATE GAMES SET WIN = " + 0 + ", LOSE = " + 0 + " WHERE IDBOARD = " + i + ";";
                DBgames.write(sql.toString() + "\n");
                stmnt.executeUpdate(sql.toString());
            }
        }catch (SQLException | IOException e){
            System.out.println(e.getMessage());
        }
    }
}
